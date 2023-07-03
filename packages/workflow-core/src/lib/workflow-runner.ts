/* eslint-disable */
import { uniqueArray } from '@ballerine/common';
import * as jsonLogic from 'json-logic-js';
import type { ActionFunction, MachineOptions, StateMachine } from 'xstate';
import { createMachine, interpret } from 'xstate';
import { HttpError } from './errors';
import type {
  ChildWorkflow,
  ObjectValues,
  WorkflowEvent,
  WorkflowEventWithoutState,
  WorkflowExtensions,
  WorkflowRunnerArgs,
} from './types';
import { Error as ErrorEnum } from './types';
import { JmespathTransformer } from './utils/context-transformers/jmespath-transformer';
import { JsonSchemaValidator } from './utils/context-validator/json-schema-validator';
import { API_PLUGIN_CLASSES, StatePlugin } from './plugins/types';
import { ApiPlugin, IApiPluginParams } from './plugins/external-plugin/api-plugin';
import { WebhookPlugin } from './plugins/external-plugin/webhook-plugin';
import { KycPlugin } from "./plugins/external-plugin/kyc-plugin";

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
  #__onEvent?: WorkflowRunnerArgs['onEvent'];
  #__doneChildWorkflows = new Map<string, boolean>();
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
      definition,
      workflowActions,
      workflowContext,
      extensions,
      childWorkflows,
      onInvokeChildWorkflow,
      onEvent,
    }: WorkflowRunnerArgs,
    debugMode = false,
  ) {
    // global and state specific extensions
    this.#__extensions = extensions ?? {};
    this.#__extensions.statePlugins ??= [];
    this.#__debugMode = debugMode;
    this.#__childWorkflows = childWorkflows;
    this.#__onInvokeChildWorkflow = onInvokeChildWorkflow;
    this.#__onEvent = onEvent;
    this.#__extensions.apiPlugins = this.initiateApiPlugins(this.#__extensions.apiPlugins ?? []);
    // this.#__defineApiPluginsStatesAsEntryActions(definition, apiPlugins);

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

  initiateApiPlugins(apiPluginSchemas: IApiPluginParams[]) {
    return apiPluginSchemas?.map(apiPluginSchema => {
      // @ts-expect-error - update types
      const requestTransformerLogic = apiPluginSchema.request.transform;
      // @ts-expect-error - update types
      const requestSchema = apiPluginSchema.request.schema;
      // @ts-expect-error - update types
      const responseTransformerLogic = apiPluginSchema.response?.transform;
      // @ts-expect-error - update types
      const responseSchema = apiPluginSchema.response?.schema;
      const requestTransformer = this.fetchTransformer(requestTransformerLogic);
      const responseTransformer =
        responseTransformerLogic && this.fetchTransformer(responseTransformerLogic);
      const requestValidator = this.fetchValidator('json-schema', requestSchema);
      const responseValidator = this.fetchValidator('json-schema', responseSchema);

      const apiPluginClass = this.pickApiPlugin(apiPluginSchema);
      const apiPlugin = new apiPluginClass({
        name: apiPluginSchema.name,
        stateNames: apiPluginSchema.stateNames,
        url: apiPluginSchema.url,
        method: apiPluginSchema.method,
        headers: apiPluginSchema.headers,
        request: { transformer: requestTransformer, schemaValidator: requestValidator },
        response: { transformer: responseTransformer, schemaValidator: responseValidator },
        successAction: apiPluginSchema.successAction,
        errorAction: apiPluginSchema.errorAction,
      });

      return apiPlugin;
    });
  }

  private pickApiPlugin(apiPluginSchema: IApiPluginParams) {
    let pluginClass;
    // @ts-ignore
    if (apiPluginSchema.pluginType == 'kyc') {
      pluginClass = KycPlugin
      // @ts-ignore
    } else if (apiPluginSchema.pluginType == 'webhook') {
      pluginClass = WebhookPlugin
      // @ts-ignore
    } else if (apiPluginSchema.pluginType == 'api') {
      pluginClass = ApiPlugin
    }
    if (pluginClass) return pluginClass;

    const isApiPlugin = this.isApiPlugin(apiPluginSchema);
    return isApiPlugin ? ApiPlugin : WebhookPlugin;
  }

  private isApiPlugin(apiPluginSchema: IApiPluginParams) {
    return !!apiPluginSchema.successAction && !!apiPluginSchema.errorAction;
  }

  fetchTransformer(transformer: any) {
    if (transformer.transformer == 'jmespath') return new JmespathTransformer(transformer.mapping.replace(/\s+/g, ' '));

    throw new Error(`Transformer ${transformer.name} is not supported`);
  }
  fetchValidator(validatorName: any, schema: any) {
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

    return createMachine({ predictableActionArguments: true, ...definition }, { actions, guards });
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
        workflowId: postSendSnapshot.machine?.id,
      })(this.#__context, event);
    }

    if (this.#__onInvokeChildWorkflow && childWorkflowsToInvoke?.length) {
      await Promise.all(
        childWorkflowsToInvoke?.map(
          async ({ definitionId, runtimeId, name, definitionVersion, initOptions }) => {
            await this.#__onInvokeChildWorkflow?.({
              definitionId,
              runtimeId,
              name,
              version: definitionVersion,
              initOptions,
            });
          },
        ),
      );
    }

    if (
      this.#__onEvent &&
      childWorkflowMetadata &&
      postSendSnapshot.done &&
      !this.#__doneChildWorkflows.has(childWorkflowMetadata.runtimeId)
    ) {
      await this.#__onEvent({
        parentWorkflowMetadata,
        childWorkflowMetadata,
        callbackInfo,
      });

      this.#__doneChildWorkflows.set(childWorkflowMetadata.runtimeId, true);
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
