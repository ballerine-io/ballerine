/* eslint-disable */
import {
  AnyRecord,
  isObject,
  ProcessStatus,
  TWorkflowHelpers,
  uniqueArray,
} from '@ballerine/common';
import { search } from 'jmespath';
import * as jsonLogic from 'json-logic-js';
import type { ActionFunction, MachineOptions, StateMachine } from 'xstate';
import { assign, createMachine, interpret } from 'xstate';
import { BUILT_IN_ACTION } from './built-in-action';
import { pluginsRegistry } from './constants';
import { HttpError } from './errors';
import { BUILT_IN_EVENT } from './index';
import { logger } from './logger';
import { ChildWorkflowPlugin } from './plugins/common-plugin/child-workflow-plugin';
import { IterativePlugin } from './plugins/common-plugin/iterative-plugin';
import { RiskRulePlugin } from './plugins/common-plugin/risk-rules-plugin';
import {
  TransformerPlugin,
  TransformerPluginParams,
} from './plugins/common-plugin/transformer-plugin';
import {
  ChildWorkflowPluginParams,
  ISerializableChildPluginParams,
  ISerializableCommonPluginParams,
  ISerializableRiskRulesPlugin,
  ISerializableWorkflowTokenPlugin,
  IterativePluginParams,
  RiskRulesPluginParams,
  WorkflowTokenPluginParams,
} from './plugins/common-plugin/types';
import { WorkflowTokenPlugin } from './plugins/common-plugin/workflow-token-plugin';
import { ApiPlugin } from './plugins/external-plugin/api-plugin';
import { BallerineEmailPlugin } from './plugins/external-plugin/ballerine-email-plugin';
import { BallerineApiPlugin } from './plugins/external-plugin/ballerine-api-plugin';
import { DispatchEventPlugin } from './plugins/external-plugin/dispatch-event-plugin';
import { KycPlugin } from './plugins/external-plugin/kyc-plugin';
import { KycSessionPlugin } from './plugins/external-plugin/kyc-session-plugin';
import {
  IApiPluginParams,
  IDispatchEventPluginParams,
  ISerializableHttpPluginParams,
} from './plugins/external-plugin/types';
import {
  ApiBallerinePlugins,
  BALLERINE_API_PLUGINS,
  BALLERINE_API_PLUGINS_KINDS,
} from './plugins/external-plugin/vendor-consts';
import { WebhookPlugin } from './plugins/external-plugin/webhook-plugin';
import {
  ActionablePlugins,
  ChildPlugins,
  CommonPlugin,
  CommonPlugins,
  HttpPlugin,
  HttpPlugins,
  StatePlugin,
} from './plugins/types';
import {
  Error as ErrorEnum,
  ObjectValues,
  SecretsManager,
  WorkflowEvent,
  WorkflowEvents,
  WorkflowEventWithoutState,
  WorkflowExtensions,
  WorkflowRunnerArgs,
  WorkflowLogEntry,
  WorkflowLogCategory,
} from './types';
import { ArrayMergeOption, deepMergeWithOptions, TContext } from './utils';
import { hasPersistResponseDestination } from './utils/has-persistence-response-destination';
import { fetchTransformers, reqResTransformersObj } from './workflow-runner-utils';
import { invariant } from 'outvariant';

export class WorkflowRunner {
  #__subscriptions: Partial<Record<string, Array<(event: WorkflowEvent) => Promise<void>>>>;
  #__workflow: StateMachine<any, any, any>;
  #__currentState: string | undefined | symbol | number | any;
  private context: any;
  #__config: any;
  #__helpers: TWorkflowHelpers;
  __extensions: WorkflowExtensions;
  #__debugMode: boolean;
  #__runtimeId: string;
  events: any;
  #__secretsManager: SecretsManager | undefined;
  #__enableLogging: boolean;
  #__auditLogs: WorkflowLogEntry[] = [];

  public get workflow() {
    return this.#__workflow;
  }

  public get state() {
    return this.#__currentState;
  }

  constructor(
    {
      runtimeId,
      definition,
      config,
      helpers,
      workflowActions,
      workflowContext,
      extensions,
      invokeRiskRulesAction,
      invokeChildWorkflowAction,
      invokeWorkflowTokenAction,
      secretsManager,
      enableLogging = true,
    }: WorkflowRunnerArgs,
    debugMode = false,
  ) {
    // global and state specific extensions
    this.#__subscriptions = {};
    this.#__helpers = helpers ?? {};
    this.__extensions = extensions ?? {};
    this.__extensions.statePlugins ??= [];
    this.#__debugMode = debugMode;
    this.#__secretsManager = secretsManager;
    this.#__enableLogging = enableLogging;

    this.__extensions.dispatchEventPlugins = this.initiateDispatchEventPlugins(
      this.__extensions.dispatchEventPlugins ?? [],
    );

    // @ts-expect-error TODO: fix this
    this.__extensions.childWorkflowPlugins = this.initiateChildPlugins(
      this.__extensions.childWorkflowPlugins ?? [],
      runtimeId,
      config,
      invokeChildWorkflowAction,
    );

    this.__extensions.apiPlugins = this.initiateApiPlugins(this.__extensions.apiPlugins ?? []);

    this.__extensions.commonPlugins = this.initiateCommonPlugins(
      // @ts-expect-error TODO: fix this
      this.__extensions.commonPlugins ?? [],
      [this.__extensions.apiPlugins, this.__extensions.childWorkflowPlugins].flat(1),
      invokeRiskRulesAction,
      invokeWorkflowTokenAction,
    );

    // this.#__defineApiPluginsStatesAsEntryActions(definition, apiPlugins);
    this.#__runtimeId = runtimeId;

    this.#__workflow = this.#__extendedWorkflow({
      definition,
      workflowActions,
    });

    // use initial context or provided context
    this.context = {
      ...(workflowContext && Object.keys(workflowContext.machineContext ?? {})?.length
        ? workflowContext.machineContext
        : definition.context ?? {}),
    };

    // use initial state or provided state
    this.#__currentState = workflowContext?.state ? workflowContext.state : definition.initial;

    this.#__config = config;
  }

  async notify(eventName: string, event: WorkflowEvent) {
    await Promise.all(
      this.#__subscriptions?.[eventName]?.map(async callback => {
        await callback(event);
      }) || [],
    );
  }

  initiateDispatchEventPlugins(
    dispatchEventPlugins: IDispatchEventPluginParams[] | DispatchEventPlugin[] | undefined,
  ) {
    return dispatchEventPlugins?.map(dispatchEventPlugin => {
      if (dispatchEventPlugin instanceof DispatchEventPlugin) {
        return dispatchEventPlugin;
      }

      return new DispatchEventPlugin({
        ...dispatchEventPlugin,
        transformers: fetchTransformers(dispatchEventPlugin.transformers || []),
      });
    });
  }

  initiateApiPlugins(apiPluginSchemas: Array<ISerializableHttpPluginParams>) {
    return apiPluginSchemas?.map(apiPluginSchema => {
      let { requestTransformer, requestValidator, responseTransformer, responseValidator } =
        reqResTransformersObj(apiPluginSchema);

      const apiPluginClass = this.pickApiPluginClass(apiPluginSchema);

      return new apiPluginClass({
        ...apiPluginSchema,
        name: apiPluginSchema.name,
        vendor: apiPluginSchema.vendor,
        template: apiPluginSchema.template,
        displayName: apiPluginSchema.displayName,
        stateNames: apiPluginSchema.stateNames,
        pluginKind: apiPluginSchema.pluginKind as ApiBallerinePlugins,
        url: apiPluginSchema.url,
        method: apiPluginSchema.method,
        headers: apiPluginSchema.headers,
        request: { transformers: requestTransformer, schemaValidator: requestValidator } as any,
        response: { transformers: responseTransformer, schemaValidator: responseValidator } as any,
        successAction: apiPluginSchema.successAction,
        errorAction: apiPluginSchema.errorAction,
        persistResponseDestination: apiPluginSchema.persistResponseDestination,
        secretsManager: this.#__secretsManager,
      });
    });
  }

  initiateRiskRulePlugin(
    riskLevelPlugin: ISerializableRiskRulesPlugin,
    callbackAction?: RiskRulesPluginParams['action'],
  ) {
    return new RiskRulePlugin({
      name: riskLevelPlugin.name,
      stateNames: riskLevelPlugin.stateNames,
      rulesSource: riskLevelPlugin.rulesSource,
      action: callbackAction!,
      helpers: this.#__helpers,
    });
  }

  initiateWorkflowTokenPlugin(
    workflowTokenPlugin: ISerializableWorkflowTokenPlugin,
    callbackAction?: WorkflowTokenPluginParams['action'],
  ) {
    return new WorkflowTokenPlugin({
      name: workflowTokenPlugin.name,
      stateNames: workflowTokenPlugin.stateNames,
      uiDefinitionId: workflowTokenPlugin.uiDefinitionId,
      expireInMinutes: workflowTokenPlugin.expireInMinutes,
      errorAction: workflowTokenPlugin.errorAction,
      successAction: workflowTokenPlugin.successAction,
      action: callbackAction!,
    });
  }

  initiateChildPlugins(
    childPluginSchemas: Array<ISerializableChildPluginParams>,
    parentWorkflowRuntimeId: string,
    parentWorkflowRuntimeConfig: unknown,
    callbackAction?: ChildWorkflowPluginParams['action'],
  ) {
    return childPluginSchemas?.map(childPluginSchema => {
      logger.log('WORKFLOW CORE:: Initiating child plugin', childPluginSchema);
      const transformers = fetchTransformers(childPluginSchema.transformers) || [];

      return new ChildWorkflowPlugin({
        name: childPluginSchema.name,
        parentWorkflowRuntimeId,
        parentWorkflowRuntimeConfig: parentWorkflowRuntimeConfig as AnyRecord,
        definitionId: childPluginSchema.definitionId,
        stateNames: childPluginSchema.stateNames,
        transformers: transformers,
        initEvent: childPluginSchema.initEvent,
        action: callbackAction!,
        successAction: childPluginSchema.successAction,
        errorAction: childPluginSchema.errorAction,
      });
    });
  }

  initiateCommonPlugins(
    pluginSchemas: Array<
      | (ISerializableCommonPluginParams & { pluginKind: 'iterative' | 'transformer' })
      | (ISerializableRiskRulesPlugin & { pluginKind: 'riskRules' })
      | (ISerializableWorkflowTokenPlugin & { pluginKind: 'attach-ui-definition' })
    >,
    actionPlugins: ActionablePlugins,
    invokeRiskRulesAction?: RiskRulePlugin['action'],
    invokeWorkflowTokenAction?: WorkflowTokenPluginParams['action'],
  ) {
    return pluginSchemas.map(pluginSchema => {
      if (pluginSchema.pluginKind === 'riskRules') {
        return this.initiateRiskRulePlugin(pluginSchema, invokeRiskRulesAction);
      }

      if (pluginSchema.pluginKind === 'attach-ui-definition') {
        return this.initiateWorkflowTokenPlugin(pluginSchema, invokeWorkflowTokenAction);
      }

      const Plugin = this.pickCommonPluginClass(pluginSchema.pluginKind);
      const pluginParams = this.pickCommonPluginParams(
        pluginSchema.pluginKind,
        pluginSchema,
        actionPlugins,
      );
      //@ts-ignore
      return new Plugin(pluginParams);
    });
  }

  private pickCommonPluginClass(pluginKind: 'iterative' | 'transformer') {
    if (pluginKind === 'iterative') return IterativePlugin;
    if (pluginKind === 'transformer') return TransformerPlugin;

    logger.log(
      'WORKFLOW CORE:: Plugin kind is not supplied or not supported, falling back to Iterative plugin.',
      {
        pluginKind,
      },
    );
    return IterativePlugin;
  }

  private pickCommonPluginParams(
    _: 'iterative' | 'transformer',
    params: unknown,
    actionPlugins: ActionablePlugins,
  ): Omit<IterativePluginParams, 'actionPluginName'> | TransformerPluginParams {
    if (TransformerPlugin.isTransformerPluginParams(params)) {
      return {
        name: params.name,
        transformers: params.transformers,
        stateNames: params.stateNames,
      };
    }

    const iterativePluginParams = params as IterativePluginParams;
    const actionPlugin = actionPlugins.find(
      //@ts-ignore
      actionPlugin => actionPlugin.name === params?.actionPluginName,
    );

    // @ts-expect-error -- params is type unknown, changing it would mean updating multiple places
    invariant(
      actionPlugin,
      `Action plugin with a name of "${params?.actionPluginName}" was not found`,
    );

    return {
      name: iterativePluginParams.name,
      stateNames: iterativePluginParams.stateNames,
      //@ts-ignore
      iterateOn: fetchTransformers(iterativePluginParams.iterateOn),
      action: (context: TContext) =>
        actionPlugin!.invoke({
          ...context,
          workflowRuntimeConfig: this.#__config,
          workflowRuntimeId: this.#__runtimeId,
        }),
      successAction: iterativePluginParams.successAction,
      errorAction: iterativePluginParams.errorAction,
      filter: iterativePluginParams.filter,
    };
  }

  private pickApiPluginClass(apiPluginSchema: ISerializableHttpPluginParams) {
    if (apiPluginSchema.pluginKind === BALLERINE_API_PLUGINS['template-email']) {
      return BallerineEmailPlugin;
    }

    if (apiPluginSchema.pluginKind === BALLERINE_API_PLUGINS['kyc-session']) {
      return KycSessionPlugin;
    }

    if (
      BALLERINE_API_PLUGINS_KINDS.includes(
        apiPluginSchema.pluginKind as (typeof BALLERINE_API_PLUGINS_KINDS)[number],
      )
    ) {
      return BallerineApiPlugin;
    }

    const Plugin = pluginsRegistry[apiPluginSchema.pluginKind as keyof typeof pluginsRegistry];

    if (!Plugin) {
      return this.isPluginWithCallbackAction(apiPluginSchema) ? ApiPlugin : WebhookPlugin;
    }

    return Plugin;
  }

  private isPluginWithCallbackAction(apiPluginSchema: IApiPluginParams) {
    return !!apiPluginSchema.successAction && !!apiPluginSchema.errorAction;
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
      await this.notify(WorkflowEvents.STATUS_UPDATE, {
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

        await this.notify(WorkflowEvents.STATUS_UPDATE, {
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

        await this.notify(WorkflowEvents.STATUS_UPDATE, {
          type,
          state: this.#__currentState,
          payload: {
            status: 'ERROR',
            action: plugin.name,
          },
          error: err,
        });

        await this.notify(WorkflowEvents.STATUS_UPDATE, {
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
     * @see {@link WorkflowRunner.sendEvent}
     *  */
    const nonBlockingPlugins =
      this.__extensions.statePlugins?.filter(plugin => !plugin.isBlocking) ?? [];

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

    const state = this.#__currentState;
    const noOp = () => {
      logger.log(`${BUILT_IN_ACTION.NO_OP} action fired`, {
        state,
      });
    };

    const actions: MachineOptions<any, any>['actions'] = {
      ...workflowActions,
      ...stateActions,
      [BUILT_IN_ACTION.NO_OP]: noOp,
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
          this.notify(WorkflowEvents.EVALUATION_ERROR, {
            type: 'RULE_EVALUATION_FAILURE',
            state: this.#__currentState,
            payload: {
              ...options,
            },
          });
        }

        return ruleResult;
      },
      jmespath: (ctx, event, metadata) => {
        const data = { ...ctx, ...event.payload };
        // @ts-expect-error
        const options = metadata.cond.options;

        const ruleResult = search(data, options.rule);

        return !!ruleResult;
      },
    };

    const updateContext = assign(
      (
        context,
        event: {
          payload: {
            context: Record<PropertyKey, unknown>;
          };
        },
      ) => {
        this.context = event.payload.context;
        return this.context;
      },
    );

    const deepMergeContext = assign(
      (
        context,
        {
          payload,
        }: {
          payload: {
            arrayMergeOption: ArrayMergeOption;
            newContext: Record<PropertyKey, unknown>;
          };
        },
      ) => {
        const mergedContext = deepMergeWithOptions(
          context,
          payload.newContext,
          payload.arrayMergeOption,
        );

        this.context = mergedContext;

        return mergedContext;
      },
    );

    return createMachine(
      {
        predictableActionArguments: true,
        ...definition,
        on: {
          [BUILT_IN_EVENT.UPDATE_CONTEXT]: {
            actions: updateContext,
          },
          [BUILT_IN_EVENT.DEEP_MERGE_CONTEXT]: {
            actions: deepMergeContext,
          },
          ...definition.on,
        },
      },
      { actions, guards },
    );
  }

  async sendEvent(event: WorkflowEventWithoutState, additionalContext?: AnyRecord) {
    const workflow = this.#__workflow.withContext(this.context);

    // Log event received
    this.auditLog({
      category: WorkflowLogCategory.EVENT_RECEIVED,
      message: `Received event: ${event.type}`,
      eventName: event.type,
      metadata: {
        currentState: this.#__currentState,
      },
    });

    logger.log('WORKFLOW CORE:: Received event', {
      eventType: event.type,
      currentState: this.#__currentState,
    });

    const previousState = this.#__currentState;

    const service = interpret(workflow)
      .start(this.#__currentState)
      .onTransition((state, context) => {
        if (state.changed) {
          // Log state transition
          this.auditLog({
            category: WorkflowLogCategory.STATE_TRANSITION,
            message: `State transitioned from ${previousState} to ${state.value}`,
            metadata: {
              tags: Array.from(state.tags),
              isDone: state.done,
              hasFailure: state.tags.has('failure'),
            },
            previousState: previousState as string,
            newState: state.value as string,
          });

          logger.log('WORKFLOW CORE:: State transitioned', {
            previousState,
            nextState: state.value,
          });

          if (state.done) {
            logger.log('WORKFLOW CORE:: Reached final state', {
              state: state.value,
            });
          }

          if (state.tags.has('failure')) {
            logger.log('WORKFLOW CORE:: Reached failure state', {
              correlationId: context?.entity?.id,
              ballerineEntityId: context?.entity?.ballerineEntityId,
            });
          }

          this.notify(WorkflowEvents.STATE_UPDATE, {
            ...event,
            state: state.value as string,
          });
        }

        this.#__currentState = state.value;
      })
      // .onEvent(event => {})
      .onChange(state => {
        // Log context change
        this.auditLog({
          category: WorkflowLogCategory.CONTEXT_CHANGED,
          message: 'Context/State changed',
          metadata: {},
        });

        logger.log('WORKFLOW CORE:: Context/State changed', { state });
      });

    // all sends() will be deferred until the workflow is started
    service.start();

    if (!service.getSnapshot().nextEvents.includes(event.type)) {
      const errorMessage = `Event ${
        event.type
      } is not allowed in the current state: ${JSON.stringify(this.#__currentState)}`;

      // Log error
      this.auditLog({
        category: WorkflowLogCategory.ERROR,
        message: errorMessage,
        metadata: {
          eventType: event.type,
          currentState: this.#__currentState,
        },
      });

      throw new Error(errorMessage);
    }

    // Non-blocking plugins are executed as actions
    // Un-like state plugins, if a state is transitioned into itself, pre-plugins will be executed each time the function is triggered
    const prePlugins =
      this.__extensions.statePlugins?.filter(
        plugin =>
          plugin.isBlocking &&
          plugin.when === 'pre' &&
          plugin.stateNames.includes(this.#__currentState),
      ) ?? [];

    const snapshot = service.getSnapshot();

    for (const prePlugin of prePlugins) {
      // Log plugin invocation
      this.auditLog({
        category: WorkflowLogCategory.PLUGIN_INVOCATION,
        message: `Invoking pre-plugin: ${prePlugin.name}`,
        pluginName: prePlugin.name,
        metadata: {
          pluginType: 'pre',
          currentState: this.#__currentState,
        },
      });

      logger.log(
        'WORKFLOW CORE:: Pre plugins are about to be deprecated. Please contact the team for more info',
      );

      await this.#__handleAction({
        type: 'STATE_ACTION_STATUS',
        plugin: prePlugin,
        workflowId: snapshot.machine?.id,
      })(snapshot.context, event);
    }

    service.send(event);

    const postSendSnapshot = service.getSnapshot();
    this.context = postSendSnapshot.context;

    if (previousState === postSendSnapshot.value) {
      this.auditLog({
        category: WorkflowLogCategory.INFO,
        message: 'No transition occurred, skipping plugins',
      });

      logger.log('WORKFLOW CORE:: No transition occurred, skipping plugins');
      return;
    }

    let commonPlugins = (this.__extensions.commonPlugins as CommonPlugins)?.filter(plugin =>
      plugin.stateNames.includes(this.#__currentState),
    );

    let childPlugins = (this.__extensions.childWorkflowPlugins as unknown as ChildPlugins)?.filter(
      plugin => plugin.stateNames?.includes(this.#__currentState),
    );

    const stateApiPlugins = (this.__extensions.apiPlugins as HttpPlugins)?.filter(plugin =>
      plugin.stateNames.includes(this.#__currentState),
    );

    const dispatchEventPlugins = (
      this.__extensions.dispatchEventPlugins as DispatchEventPlugin[]
    )?.filter(plugin => plugin.stateNames.includes(this.#__currentState));

    if (dispatchEventPlugins) {
      for (const dispatchEventPlugin of dispatchEventPlugins) {
        // Log plugin invocation
        this.auditLog({
          category: WorkflowLogCategory.PLUGIN_INVOCATION,
          message: `Invoking dispatch event plugin: ${dispatchEventPlugin.name}`,
          pluginName: dispatchEventPlugin.name,
          metadata: {
            pluginType: 'dispatchEvent',
            currentState: this.#__currentState,
          },
        });

        await this.__dispatchEvent(dispatchEventPlugin);
      }
    }

    if (childPlugins) {
      for (const childPlugin of childPlugins) {
        // Log plugin invocation
        this.auditLog({
          category: WorkflowLogCategory.PLUGIN_INVOCATION,
          message: `Invoking child plugin: ${childPlugin.name}`,
          pluginName: childPlugin.name,
          metadata: {
            pluginType: 'child',
            currentState: this.#__currentState,
          },
        });

        await this.__invokeChildPlugin(childPlugin);
      }
    }

    if (commonPlugins) {
      for (const commonPlugin of commonPlugins) {
        // Log plugin invocation
        this.auditLog({
          category: WorkflowLogCategory.PLUGIN_INVOCATION,
          message: `Invoking common plugin: ${commonPlugin.name}`,
          pluginName: commonPlugin.name,
          metadata: {
            pluginType: 'common',
            currentState: this.#__currentState,
          },
        });

        await this.__invokeCommonPlugin(commonPlugin);
      }
    }

    if (stateApiPlugins) {
      for (const apiPlugin of stateApiPlugins) {
        // Log plugin invocation
        this.auditLog({
          category: WorkflowLogCategory.PLUGIN_INVOCATION,
          message: `Invoking API plugin: ${apiPlugin.name}`,
          pluginName: apiPlugin.name,
          metadata: {
            pluginType: 'api',
            currentState: this.#__currentState,
          },
        });

        await this.__invokeApiPlugin(apiPlugin, additionalContext);
      }
    }

    if (this.#__debugMode) {
      logger.log('WORKFLOW CORE:: context:', this.context);
    }

    // Intentionally positioned after service.start() and service.send()
    const postPlugins =
      this.__extensions.statePlugins?.filter(
        plugin =>
          plugin.isBlocking &&
          plugin.when === 'post' &&
          plugin.stateNames.includes(this.#__currentState),
      ) ?? [];

    for (const postPlugin of postPlugins) {
      // Log plugin invocation
      this.auditLog({
        category: WorkflowLogCategory.PLUGIN_INVOCATION,
        message: `Invoking post-plugin: ${postPlugin.name}`,
        metadata: {
          pluginType: 'post',
          pluginName: postPlugin.name,
          currentState: this.#__currentState,
        },
      });

      await this.#__handleAction({
        type: 'STATE_ACTION_STATUS',
        plugin: postPlugin,
        // TODO: Might want to refactor to use this.#__runtimeId
        workflowId: postSendSnapshot.machine?.id,
      })(this.context, event);
    }
  }

  private async __invokeCommonPlugin(commonPlugin: CommonPlugin) {
    // @ts-expect-error - multiple types of plugins return different responses
    const { callbackAction, error, response } = await commonPlugin.invoke?.({
      ...this.context,
      workflowRuntimeConfig: this.#__config,
      workflowRuntimeId: this.#__runtimeId,
    });

    if (!!error) {
      this.context.pluginsOutput = {
        ...(this.context.pluginsOutput || {}),
        ...{ [commonPlugin.name]: { error: error } },
      };
    }

    if (!!response) {
      if (hasPersistResponseDestination(commonPlugin)) {
        if (response) {
          this.context = this.mergeToContext(
            this.context,
            response,
            commonPlugin.persistResponseDestination,
          );
        }
      } else {
        this.context.pluginsOutput = {
          ...(this.context.pluginsOutput || {}),
          ...{ [commonPlugin.name]: response },
        };
      }
    }

    if (callbackAction) {
      await this.sendEvent({ type: callbackAction });
    }
  }

  private async __invokeChildPlugin(childPlugin: ChildWorkflowPlugin) {
    const { callbackAction } = await childPlugin.invoke?.({
      ...this.context,
      workflowRuntimeConfig: this.#__config,
      workflowRuntimeId: this.#__runtimeId,
    });

    if (callbackAction) {
      await this.sendEvent({ type: callbackAction });
    }
  }

  private async __invokeApiPlugin(apiPlugin: HttpPlugin, additionalContext?: AnyRecord) {
    // @ts-expect-error - multiple types of plugins return different responses
    const { callbackAction, responseBody, requestPayload, error } = await apiPlugin.invoke?.(
      {
        ...this.context,
        workflowRuntimeConfig: this.#__config,
        workflowRuntimeId: this.#__runtimeId,
      },
      additionalContext,
    );

    if (error) {
      console.error(error);
      logger.error('WORKFLOW CORE:: Error invoking plugin', {
        error,
        stack: error instanceof Error ? error.stack : undefined,
        name: apiPlugin.name,
      });
    }

    if (!this.isPluginWithCallbackAction(apiPlugin)) {
      logger.log('WORKFLOW CORE:: Plugin does not have callback action', {
        name: apiPlugin.name,
      });

      return;
    }

    if (apiPlugin.persistResponseDestination && responseBody) {
      this.context = this.mergeToContext(
        this.context,
        responseBody,
        apiPlugin.persistResponseDestination,
      );

      this.context = this.mergeToContext(
        this.context,
        { requestPayload, status: ProcessStatus.SUCCESS },
        `pluginsInput.${apiPlugin.name}`,
      );
    }

    if (!apiPlugin.persistResponseDestination && responseBody) {
      this.context = this.mergeToContext(
        this.context,
        responseBody,
        `pluginsOutput.${apiPlugin.name}`,
      );

      this.context = this.mergeToContext(
        this.context,
        { requestPayload, status: ProcessStatus.SUCCESS },
        `pluginsInput.${apiPlugin.name}`,
      );
    }

    if (error) {
      this.context = this.mergeToContext(
        this.context,
        { name: apiPlugin.name, error, status: ProcessStatus.ERROR },
        `pluginsOutput.${apiPlugin.name}`,
      );

      this.context = this.mergeToContext(
        this.context,
        { requestPayload, error, status: ProcessStatus.ERROR },
        `pluginsInput.${apiPlugin.name}`,
      );
    }

    await this.sendEvent({ type: callbackAction });
  }

  private async __dispatchEvent(dispatchEventPlugin: DispatchEventPlugin) {
    const { eventName, event } = await dispatchEventPlugin.getPluginEvent(this.context);

    logger.log('WORKFLOW CORE:: Dispatching notification to host', {
      eventName,
      event,
    });

    try {
      await this.notify(eventName, event);

      logger.log('WORKFLOW CORE:: Dispatched notification to host successfully', { eventName });
    } catch (error) {
      logger.error('WORKFLOW CORE:: Failed dispatching notification to host', {
        eventName,
        event,
        error,
      });

      if (dispatchEventPlugin.errorAction) {
        await this.sendEvent({ type: dispatchEventPlugin.errorAction });
      }

      return;
    }

    if (dispatchEventPlugin.successAction) {
      await this.sendEvent({ type: dispatchEventPlugin.successAction });
    }
  }

  subscribe(eventName: string, callback: (event: WorkflowEvent) => Promise<void>) {
    if (!this.#__subscriptions[eventName]) {
      this.#__subscriptions[eventName] = [];
    }

    this.#__subscriptions[eventName]?.push(callback);
  }

  getSnapshot() {
    const service = interpret(this.#__workflow.withContext(this.context));
    service.start(this.#__currentState);
    return service.getSnapshot();
  }

  overrideContext(context: any) {
    return (this.context = context);
  }

  async invokePlugin(pluginName: string, additionalContext?: AnyRecord) {
    const { apiPlugins, commonPlugins, childWorkflowPlugins, dispatchEventPlugins } =
      this.__extensions;

    const pluginToInvoke = [
      ...(apiPlugins ?? []),
      ...(commonPlugins ?? []),
      ...(childWorkflowPlugins ?? []),
      ...(dispatchEventPlugins ?? []),
    ]
      .filter(plugin => !!plugin)
      .find(plugin => plugin?.name === pluginName);

    if (!pluginToInvoke) {
      return;
    }

    if (this.isHttpPlugin(pluginToInvoke)) {
      return await this.__invokeApiPlugin(pluginToInvoke, additionalContext);
    }

    if (this.isCommonPlugin(pluginToInvoke)) {
      //@ts-ignore
      return await this.__invokeCommonPlugin(pluginToInvoke);
    }

    if (this.isDispatchEventPlugin(pluginToInvoke)) {
      return await this.__dispatchEvent(pluginToInvoke);
    }
  }

  isCommonPlugin(pluginToInvoke: unknown) {
    return pluginToInvoke instanceof IterativePlugin || pluginToInvoke instanceof TransformerPlugin;
  }

  isHttpPlugin(plugin: unknown): plugin is HttpPlugin {
    return (
      plugin instanceof ApiPlugin || plugin instanceof WebhookPlugin || plugin instanceof KycPlugin
    );
  }

  isDispatchEventPlugin(pluginToInvoke: unknown): pluginToInvoke is DispatchEventPlugin {
    return pluginToInvoke instanceof DispatchEventPlugin;
  }

  mergeToContext(
    sourceContext: Record<string, any>,
    informationToPersist: Record<string, any>,
    pathToPersist?: string,
  ) {
    if (!pathToPersist) {
      return this.deepMerge(informationToPersist, sourceContext);
    }

    const keys = pathToPersist.split('.') as Array<string>;
    let obj = sourceContext;

    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i] as string;
      if (!obj[key]) {
        obj[key] = {};
      }
      obj = obj[key];
    }

    const finalKey = keys[keys.length - 1] as string;
    if (!obj[finalKey]) {
      obj[finalKey] = {};
    }

    obj[finalKey] = this.deepMerge(informationToPersist, obj[finalKey]);

    return sourceContext;
  }

  deepMerge(source: Record<string, any>, target: Record<string, any>) {
    const output = { ...target };

    if (isObject(target) && isObject(source)) {
      Object.keys(source).forEach(key => {
        if (isObject(source[key])) {
          if (!target[key]) {
            Object.assign(output, { [key]: source[key] });
          } else {
            output[key] = this.deepMerge(source[key], target[key]);
          }
        } else {
          Object.assign(output, { [key]: source[key] });
        }
      });
    }

    return output;
  }

  // Add new method to get logs
  getLogs(): WorkflowLogEntry[] {
    return [...this.#__auditLogs];
  }

  // Add new method to clear logs
  clearLogs(): void {
    this.#__auditLogs = [];
  }

  // Add log method
  private auditLog({
    category,
    message,
    metadata,
    previousState,
    newState,
    eventName,
    pluginName,
  }: {
    category: WorkflowLogCategory;
    message: string;
    metadata?: Record<string, any>;
    previousState?: string;
    newState?: string;
    eventName?: string;
    pluginName?: string;
  }): void {
    if (!this.#__enableLogging) return;

    this.#__auditLogs.push({
      category,
      message,
      timestamp: new Date().toISOString(),
      metadata,
      previousState,
      newState,
      eventName,
      pluginName,
    });
  }
}
