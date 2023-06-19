/* eslint-disable */
import { uniqueArray } from '@ballerine/common';
import * as jsonLogic from 'json-logic-js';
import type { ActionFunction, MachineOptions, StateMachine } from 'xstate';
import { createMachine, interpret } from 'xstate';
import { HttpError } from './errors';
import type {
  ObjectValues,
  StatePlugin,
  WorkflowEvent,
  WorkflowEventWithoutState,
  WorkflowExtensions,
  WorkflowRunnerArgs,
} from './types';
import { Error as ErrorEnum } from './types';

abstract class Plugin {
  onTransition(workflowRunner, sourceStateName, targetStateName) {}
  async beforeTransition(workflowRunner, sourceStateName, targetStateName) {}
}

export class CallApiPlugin extends Plugin {
  constructor(
    private states,
    private successAction,
    private errorAction,
    private url,
    private method,
  ) {
    super();
  }

  onTransition(workflowRunner, sourceStateName, targetStateName) {
    if (!this.states.includes(targetStateName)) return;

    fetch(this.url, { method: this.method, body: '' }).then(response => {
      if (response.ok) {
        workflowRunner.sendEvent(this.successAction);
      } else {
        workflowRunner.sendEvent(this.errorAction);
      }
    });
  }
}

export class BlockingPostPlugin extends Plugin {
  constructor(private states, private action) {
    super();
  }

  onTransition(workflowRunner, sourceStateName, targetStateName) {
    console.log('asdasdasd');
    this.action();
  }
}

export class WorkflowRunner {
  #__subscription: Array<(event: WorkflowEvent) => void> = [];
  #__workflow: StateMachine<any, any, any>;
  #__currentState: string | undefined | symbol | number | any;
  #__context: any;
  #__callback: ((event: WorkflowEvent) => void) | null = null;
  #__extensions: WorkflowExtensions;
  #__debugMode: boolean;

  public get workflow() {
    return this.#__workflow;
  }

  public get state() {
    return this.#__currentState;
  }

  constructor(
    { definition, workflowActions, workflowContext, extensions }: WorkflowRunnerArgs,
    debugMode = true,
  ) {
    // global and state specific extensions
    this.#__extensions = extensions ?? {};
    this.#__extensions.statePlugins ??= [];
    this.#__debugMode = debugMode;

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

  #__defineStatePluginsAction(definition: any, statePlugin, stateActions) {
    const handledAction = this.#__handleAction({
      type: 'STATE_ACTION_STATUS',
      plugin: statePlugin,
    });

    for (const stateName of statePlugin.stateNames) {
      if (!definition.states[stateName]) {
        throw new Error(`${stateName} is not defined within the workflow definition's states`);
      }
    }
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
    const actions: MachineOptions<any, any>['actions'] = {
      ...workflowActions,
      ...stateActions,
    };

    const guards: MachineOptions<any, any>['guards'] = {
      'json-rule': (ctx, { payload }, { cond }) => {
        const data = { ...ctx, ...payload };
        return jsonLogic.apply(
          cond.name, // Rule
          data, // Data
        );
      },
    };

    return createMachine({ predictableActionArguments: true, ...definition }, { actions, guards });
  }

  async sendEvent(event: WorkflowEventWithoutState) {
    const workflow = this.#__workflow.withContext(this.#__context);

    console.log('Current state:', this.#__currentState);

    const service = interpret(workflow);

    service.onTransition(state => {
      if (state.changed) {
        console.log('Transitioned into', state.value);

        for (const plugin of this.#__extensions.plugins || []) {
          plugin.onTransition(this, this.#__currentState, state.value);
        }

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

    service.start(this.#__currentState);

    const targetState = service.nextState(event);
    const targetStateName = targetState.value;

    if (this.#__currentState !== targetStateName) {
      for (const plugin of this.#__extensions.plugins || []) {
        await plugin.beforeTransition(this, this.#__currentState, targetStateName);
      }
    }

    service.send(event);

    if (this.#__debugMode) {
      console.log('context:', this.#__context);
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
