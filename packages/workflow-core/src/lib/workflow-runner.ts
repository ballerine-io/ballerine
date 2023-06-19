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
  onDone() {}
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

  async beforeTransition(workflowRunner, sourceStateName, targetStateName) {
    await this.action();
  }
}

class StatusPlugin extends Plugin {
  constructor(private plugin) {
    super();
  }

  onTransition(workflowRunner, sourceStateName, targetStateName) {
    workflowRunner.callback?.({
      type,
      state: targetStateName,
      payload: {
        status: 'PENDING',
        action: this.plugin.name,
      },
    });

    //if (this.#__callback) {
    //  this.#__callback({
    //    ...event,
    //    state: state.value as string,
    //  });
    //}

    try {
      this.plugin.onTransition();

      workflowRunner.callback?.({
        type,
        state: targetStateName,
        payload: {
          status: 'SUCCESS',
          action: this.plugin.name,
        },
      });
    } catch (err) {
      let errorType: ObjectValues<typeof ErrorEnum> = ErrorEnum.ERROR;

      if (err instanceof HttpError) {
        errorType = ErrorEnum.HTTP_ERROR;
      }

      workflowRunner.callback?.({
        type,
        state: targetStateName,
        payload: {
          status: 'ERROR',
          action: this.plugin.name,
        },
        error: err,
      });

      workflowRunner.callback?.({
        type: errorType,
        state: targetStateName,
        error: err,
      });
    }
  }

  async beforeTransition(workflowRunner, sourceStateName, targetStateName) {
    workflowRunner.callback?.({
      type,
      state: sourceStateName,
      payload: {
        status: 'PENDING',
        action: this.plugin.name,
      },
    });

    try {
      await this.plugin.beforeTransition();

      workflowRunner.callback?.({
        type,
        state: sourceStateName,
        payload: {
          status: 'SUCCESS',
          action: this.plugin.name,
        },
      });
    } catch (err) {
      let errorType: ObjectValues<typeof ErrorEnum> = ErrorEnum.ERROR;

      if (err instanceof HttpError) {
        errorType = ErrorEnum.HTTP_ERROR;
      }

      workflowRunner.callback?.({
        type,
        state: sourceStateName,
        payload: {
          status: 'ERROR',
          action: this.plugin.name,
        },
        error: err,
      });

      workflowRunner.callback?.({
        type: errorType,
        state: sourceStateName,
        error: err,
      });
    }
  }
}

class DebugLogPlugin extends Plugin {
  onTransition(workflowRunner, sourceStateName, targetStateName) {
    console.log('Transitioned into', targetStateName);
    console.log('context:', workflowRunner.context);
  }

  onDone() {
    console.log('Reached final state');
  }

  async beforeTransition(workflowRunner, sourceStateName, targetStateName) {
    console.log('Current state:', sourceStateName);
  }
}

export class WorkflowRunner {
  #__subscription: Array<(event: WorkflowEvent) => void> = [];
  #__workflow: StateMachine<any, any, any>;
  #__currentState: string | undefined | symbol | number | any;
  #__extensions: WorkflowExtensions;
  #__debugMode: boolean;
  #__plugins: Array<Plugin>;

  context: any;
  callback: ((event: WorkflowEvent) => void) | null = null;

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
    this.#__plugins = Array<Plugin>();

    for (const statePlugin of this.#__extensions.statePlugins) {
      for (const stateName of statePlugin.stateNames) {
        if (!definition.states[stateName]) {
          throw new Error(`${stateName} is not defined within the workflow definition's states`);
        }
      }
    }

    for (const plugin in this.#__extensions.plugins) {
      this.#__plugins.push(new StatusPlugin(plugin));
    }

    if (debugMode) {
      this.#__plugins.push(DebugLogPlugin);
    }

    this.#__workflow = createMachine(
      { predictableActionArguments: true, ...definition },
      { actions: workflowActions },
    );

    // use initial context or provided context
    this.context =
      workflowContext && Object.keys(workflowContext.machineContext ?? {})?.length
        ? workflowContext.machineContext
        : definition.context || {};

    // use initial state or provided state
    this.#__currentState = workflowContext?.state ? workflowContext.state : definition.initial;
  }

  async sendEvent(event: WorkflowEventWithoutState) {
    const workflow = this.#__workflow.withContext(this.context);

    const service = interpret(workflow);

    service.onTransition(state => {
      if (state.changed) {
        for (const plugin of this.#__extensions.plugins || []) {
          plugin.onTransition(this, this.#__currentState, state.value);
        }

        if (state.done) {
          plugin.onDone();
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
  }

  subscribe(callback: (event: WorkflowEvent) => void) {
    this.callback = callback;
    // Not currently in use.
    this.#__subscription.push(callback);
  }

  getSnapshot() {
    const service = interpret(this.#__workflow.withContext(this.context));
    service.start(this.#__currentState);
    return service.getSnapshot();
  }
}
