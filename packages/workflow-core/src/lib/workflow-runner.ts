/* eslint-disable */
import { AnyRecord, uniqueArray } from '@ballerine/common';
import * as jsonLogic from 'json-logic-js';
import type { ActionFunction, MachineOptions, StateMachine } from 'xstate';
import { assign, createMachine, interpret } from 'xstate';
import { HttpError } from './errors';
import type {
  ChildWorkflow,
  IUpdateContextEvent,
  ObjectValues,
  WorkflowEvent,
  WorkflowEventWithoutState,
  WorkflowExtensions,
  WorkflowRunnerArgs,
} from './types';
import { Error as ErrorEnum } from './types';
import { JmespathTransformer } from './utils/context-transformers/jmespath-transformer';
import { JsonSchemaValidator } from './utils/context-validator/json-schema-validator';
import { StatePlugin } from './plugins/types';
import { ApiPlugin } from './plugins/external-plugin/api-plugin';
import { WebhookPlugin } from './plugins/external-plugin/webhook-plugin';
import {
  IApiPluginParams,
  ISerializableApiPluginParams,
  SerializableValidatableTransformer,
} from './plugins/external-plugin/types';
import { HelpersTransformer } from './utils/context-transformers/helpers-transformer';
import { KycPlugin } from './plugins/external-plugin/kyc-plugin';
import { THelperFormatingLogic } from './utils/context-transformers/types';

export class WorkflowRunner {
  #__subscription: Array<(event: WorkflowEvent) => void> = [];
  #__workflow: StateMachine<any, any, any>;
  #__currentState: string | undefined | symbol | number | any;
  #__context: any;
  #__callback: ((event: WorkflowEvent) => void) | null = null;
  #__extensions: WorkflowExtensions;
  #__debugMode: boolean;
  #__childWorkflows?: Array<ChildWorkflow>;
  #__onInvokeChildWorkflow?: WorkflowRunnerArgs['onInvokeChildWorkflow'];
  #__onDoneChildWorkflow?: WorkflowRunnerArgs['onDoneChildWorkflow'];
  #__invokedOnDoneChildWorkflow = false;
  #__runtimeId: string;
  events: any;

  public get workflow() {
    return this.#__workflow;
  }

  public get context() {
    return this.#__context;
  }
  public get state() {
    return this.#__currentState;
  }

  constructor(
    {
      runtimeId,
      definition,
      workflowActions,
      workflowContext,
      extensions,
      childWorkflows,
      onInvokeChildWorkflow,
      onDoneChildWorkflow,
    }: WorkflowRunnerArgs,
    debugMode = false,
  ) {
    // global and state specific extensions
    this.#__extensions = extensions ?? {};
    this.#__extensions.statePlugins ??= [];
    this.#__debugMode = debugMode;
    this.#__childWorkflows = childWorkflows;
    this.#__onInvokeChildWorkflow = onInvokeChildWorkflow;
    this.#__onDoneChildWorkflow = onDoneChildWorkflow;
    // @ts-expect-error TODO: fix this
    this.#__extensions.apiPlugins = this.initiateApiPlugins(this.#__extensions.apiPlugins ?? []);
    // this.#__defineApiPluginsStatesAsEntryActions(definition, apiPlugins);
    this.#__runtimeId = runtimeId;

    this.#__workflow = this.#__extendedWorkflow({
      definition,
      workflowActions,
    });

    // use initial context or provided context
    this.#__context =
      workflowContext && Object.keys(workflowContext.machineContext ?? {})?.length
        ? workflowContext.machineContext
        : definition.context || {};

    // use initial state or provided state
    this.#__currentState = workflowContext?.state ? workflowContext.state : definition.initial;
  }

  initiateApiPlugins(apiPluginSchemas: Array<ISerializableApiPluginParams>) {
    return apiPluginSchemas?.map(apiPluginSchema => {
      const requestTransformerLogic = apiPluginSchema.request.transform;
      const requestSchema = apiPluginSchema.request.schema;
      const responseTransformerLogic = apiPluginSchema.response?.transform;
      const responseSchema = apiPluginSchema.response?.schema;
      // @ts-ignore
      const requestTransformer = this.fetchTransformers(requestTransformerLogic);
      const responseTransformer =
        responseTransformerLogic && this.fetchTransformers(responseTransformerLogic);
      // @ts-expect-error TODO: fix this
      const requestValidator = this.fetchValidator('json-schema', requestSchema);
      // @ts-expect-error TODO: fix this
      const responseValidator = this.fetchValidator('json-schema', responseSchema);

      const apiPluginClass = this.pickApiPlugin(apiPluginSchema);
      const apiPlugin = new apiPluginClass({
        name: apiPluginSchema.name,
        stateNames: apiPluginSchema.stateNames,
        url: apiPluginSchema.url,
        method: apiPluginSchema.method,
        headers: apiPluginSchema.headers,
        request: { transformers: requestTransformer, schemaValidator: requestValidator },
        response: { transformers: responseTransformer, schemaValidator: responseValidator },
        successAction: apiPluginSchema.successAction,
        errorAction: apiPluginSchema.errorAction,
      });

      return apiPlugin;
    });
  }

  private pickApiPlugin(apiPluginSchema: ISerializableApiPluginParams) {
    let pluginClass;
    // @ts-ignore
    if (apiPluginSchema.pluginType == 'kyc') {
      pluginClass = KycPlugin;
      // @ts-ignore
    } else if (apiPluginSchema.pluginType == 'webhook') {
      pluginClass = WebhookPlugin;
      // @ts-ignore
    } else if (apiPluginSchema.pluginType == 'api') {
      pluginClass = ApiPlugin;
    }
    if (pluginClass) return pluginClass;
    // @ts-expect-error TODO: fix this
    const isApiPlugin = this.isApiPlugin(apiPluginSchema);
    return isApiPlugin ? ApiPlugin : WebhookPlugin;
  }

  private isApiPlugin(apiPluginSchema: IApiPluginParams) {
    return !!apiPluginSchema.successAction && !!apiPluginSchema.errorAction;
  }

  fetchTransformers(
    transformers: SerializableValidatableTransformer['transform'] & {
      name?: string;
    },
  ) {
    return (
      transformers?.map(transformer => {
        if (transformer.transformer == 'jmespath')
          return new JmespathTransformer((transformer.mapping as string).replace(/\s+/g, ' '));
        if (transformer.transformer == 'helper') {
          return new HelpersTransformer(transformer.mapping as THelperFormatingLogic);
        }

        throw new Error(`Transformer ${transformer} is not supported`);
      }) || []
    );
  }
  fetchValidator(
    validatorName: string,
    schema: ConstructorParameters<typeof JsonSchemaValidator>[0],
  ) {
    if (!schema) return;
    if (validatorName === 'json-schema') return new JsonSchemaValidator(schema);

    throw new Error(`Validator ${validatorName} is not supported`);
  }

  #__handleAction({
    type,
    plugin,
    workflowId = '',
  }: {
    // Will be a union.
    type: 'STATE_ACTION_STATUS';
    plugin: Pick<StatePlugin, 'name' | 'action'>;
    workflowId?: string;
  }) {
    return async (context: Record<string, unknown>, event: Record<PropertyKey, unknown>) => {
      this.#__callback?.({
        type,
        state: this.#__currentState,
        payload: {
          status: 'PENDING',
          action: plugin.name,
        },
      });

      try {
        await plugin.action({
          workflowId,
          context,
          event,
          state: this.#__currentState,
        });

        this.#__callback?.({
          type,
          state: this.#__currentState,
          payload: {
            status: 'SUCCESS',
            action: plugin.name,
          },
        });
      } catch (err) {
        let errorType: ObjectValues<typeof ErrorEnum> = ErrorEnum.ERROR;

        if (err instanceof HttpError) {
          errorType = ErrorEnum.HTTP_ERROR;
        }

        this.#__callback?.({
          type,
          state: this.#__currentState,
          payload: {
            status: 'ERROR',
            action: plugin.name,
          },
          error: err,
        });

        this.#__callback?.({
          type: errorType,
          state: this.#__currentState,
          error: err,
        });
      }
    };
  }

  #__extendedWorkflow({
    definition,
    workflowActions,
  }: {
    definition: any;
    workflowActions?: WorkflowRunnerArgs['workflowActions'];
  }) {
    const stateActions: Record<string, ActionFunction<any, any>> = {};
    /**
     * Blocking plugins are not injected as actions
     *
     * @see {@link WorfklowRunner.sendEvent}
     *  */
    const nonBlockingPlugins =
      this.#__extensions.statePlugins?.filter(plugin => !plugin.isBlocking) ?? [];

    for (const statePlugin of nonBlockingPlugins) {
      const when = statePlugin.when === 'pre' ? 'entry' : 'exit';
      const handledAction = this.#__handleAction({
        type: 'STATE_ACTION_STATUS',
        plugin: statePlugin,
      });

      for (const stateName of statePlugin.stateNames) {
        if (!definition.states[stateName]) {
          throw new Error(`${stateName} is not defined within the workflow definition's states`);
        }

        // E.g { state: { entry: [...,plugin.name] } }
        definition.states[stateName][when] = uniqueArray([
          ...(definition.states[stateName][when] ?? []),
          statePlugin.name,
        ]);

        // workflow-core
        // { actions: { persist: action } }
        stateActions[statePlugin.name] ??= handledAction;
      }
    }

    const actions: MachineOptions<any, any>['actions'] = {
      ...workflowActions,
      ...stateActions,
    };

    const guards: MachineOptions<any, any>['guards'] = {
      'json-logic': (ctx, event, metadata) => {
        const data = { ...ctx, ...event.payload };
        // @ts-expect-error
        const options = metadata.cond.options;

        const ruleResult = jsonLogic.apply(
          options.rule, // Rule
          data, // Data
        );
        if (!ruleResult && options.assignOnFailure) {
          this.#__callback?.({
            type: 'RULE_EVALUATION_FAILURE',
            state: this.#__currentState,
            payload: {
              ...options,
            },
          });
        }
        return ruleResult;
      },
    };

    const updateContext = assign<Record<PropertyKey, any>, IUpdateContextEvent>(
      (context, event) => {
        context = {
          ...context,
          ...event.payload,
        };

        return context;
      },
    );

    return createMachine(
      {
        predictableActionArguments: true,
        on: {
          UPDATE_CONTEXT: {
            actions: updateContext,
          },
        },
        ...definition,
      },
      { actions, guards },
    );
  }

  async sendEvent(event: WorkflowEventWithoutState) {
    const workflow = this.#__workflow.withContext(this.#__context);

    console.log('Current state:', this.#__currentState);

    const service = interpret(workflow)
      .start(this.#__currentState)
      .onTransition(state => {
        if (state.changed) {
          console.log('Transitioned into', state.value);

          if (state.done) {
            console.log('Reached final state');
          }

          if (this.#__callback) {
            this.#__callback({
              ...event,
              state: state.value as string,
            });
          }
        }

        this.#__currentState = state.value;
      });

    // all sends() will be deferred until the workflow is started
    service.start();

    // Non-blocking plugins are executed as actions
    const prePlugins =
      this.#__extensions.statePlugins?.filter(
        plugin =>
          plugin.isBlocking &&
          plugin.when === 'pre' &&
          plugin.stateNames.includes(this.#__currentState),
      ) ?? [];
    const snapshot = service.getSnapshot();

    for (const prePlugin of prePlugins) {
      await this.#__handleAction({
        type: 'STATE_ACTION_STATUS',
        plugin: prePlugin,
        workflowId: snapshot.machine?.id,
      })(snapshot.context, event);
    }

    service.send(event);

    const postSendSnapshot = service.getSnapshot();
    const { childWorkflowMetadata, parentWorkflowMetadata, callbackInfo } =
      postSendSnapshot.context ?? {};

    this.#__context = postSendSnapshot.context;

    if (this.#__extensions.apiPlugins) {
      for (const apiPlugin of this.#__extensions.apiPlugins) {
        if (!apiPlugin.stateNames.includes(this.#__currentState)) continue;

        const { callbackAction, responseBody, error } = await apiPlugin.callApi?.(this.#__context);
        // @ts-expect-error - update webhook plugin to use serializable interface
        if (!this.isApiPlugin(apiPlugin)) continue;

        this.#__context.pluginsOutput = {
          ...(this.#__context.pluginsOutput || {}),
          ...{ [apiPlugin.name]: responseBody ? responseBody : { error: error } },
        };
        await this.sendEvent(callbackAction);
      }
    }

    if (this.#__debugMode) {
      console.log('context:', this.#__context);
    }

    // Intentionally positioned after service.start() and service.send()
    const postPlugins =
      this.#__extensions.statePlugins?.filter(
        plugin =>
          plugin.isBlocking &&
          plugin.when === 'post' &&
          plugin.stateNames.includes(this.#__currentState),
      ) ?? [];
    // Only iterate over the child workflows that are configured to run in the current state.
    const childWorkflowsToInvoke =
      this.#__childWorkflows?.filter(({ stateNames }) =>
        stateNames?.includes(this.#__currentState),
      ) ?? [];

    for (const postPlugin of postPlugins) {
      await this.#__handleAction({
        type: 'STATE_ACTION_STATUS',
        plugin: postPlugin,
        // TODO: Might want to refactor to use this.#__runtimeId
        workflowId: postSendSnapshot.machine?.id,
      })(this.#__context, event);
    }

    if (this.#__onInvokeChildWorkflow && childWorkflowsToInvoke?.length) {
      const results = await Promise.allSettled(
        childWorkflowsToInvoke?.map(
          async ({
            definitionId,
            name,
            version,
            initOptions,
            parentContextToCopy,
            callbackInfo,
          }) => {
            try {
              let context = this.#__context;

              if (parentContextToCopy) {
                const parentTransformers = this.fetchTransformers(parentContextToCopy.transform);

                for (const parentTransformer of parentTransformers) {
                  context = await parentTransformer.transform(context);
                }
              }

              const result = await this.#__onInvokeChildWorkflow?.({
                childWorkflowMetadata: {
                  definitionId,
                  name,
                  version,
                  initOptions,
                  callbackInfo,
                },
                parentWorkflowMetadata: {
                  runtimeId: this.#__runtimeId,
                  state: this.#__currentState,
                  context: parentContextToCopy ? context : undefined,
                },
              });

              let data = result;

              if (callbackInfo?.childContextToCopy) {
                const childTransformers = this.fetchTransformers(
                  callbackInfo.childContextToCopy.transform,
                );

                for (const childTransformer of childTransformers) {
                  data = await childTransformer.transform(data as AnyRecord);
                }
              }

              return {
                data: callbackInfo?.childContextToCopy ? data : undefined,
                error: undefined,
              };
            } catch (error) {
              console.error(error);

              return {
                data: undefined,
                error,
              };
            }
          },
        ),
      );
      const childWorkflows = results?.map(result => {
        if (result?.status !== 'fulfilled') return;

        return {
          data: result?.value?.data,
          error: undefined,
        };
      });

      this.#__context.childWorkflows = childWorkflows;
      service.send({
        type: 'UPDATE_CONTEXT',
        payload: {
          childWorkflows,
        },
      });
    }

    if (
      this.#__onDoneChildWorkflow &&
      childWorkflowMetadata &&
      postSendSnapshot.done &&
      !this.#__invokedOnDoneChildWorkflow
    ) {
      let payload = postSendSnapshot?.context;

      if (callbackInfo?.childContextToCopy) {
        const childTransformers = this.fetchTransformers(callbackInfo.childContextToCopy.transform);

        for (const childTransformer of childTransformers) {
          payload = await childTransformer.transform(payload as AnyRecord);
        }
      }

      await this.#__onDoneChildWorkflow(
        {
          type: callbackInfo?.event,
          payload: callbackInfo?.childContextToCopy ? payload : undefined,
        },
        {
          source: {
            runtimeId: this.#__runtimeId,
            definitionId: childWorkflowMetadata?.definitionId,
            version: childWorkflowMetadata?.version,
            state: this.#__currentState,
            event: event.type,
          },
          target: {
            runtimeId: parentWorkflowMetadata?.runtimeId,
            definitionId: parentWorkflowMetadata?.definitionId,
            version: parentWorkflowMetadata?.version,
            state: parentWorkflowMetadata?.state,
          },
        },
      );

      this.#__invokedOnDoneChildWorkflow = true;
    }
  }

  subscribe(callback: (event: WorkflowEvent) => void) {
    this.#__callback = callback;
    // Not currently in use.
    this.#__subscription.push(callback);
  }

  getSnapshot() {
    const service = interpret(this.#__workflow.withContext(this.#__context));
    service.start(this.#__currentState);
    return service.getSnapshot();
  }
}
