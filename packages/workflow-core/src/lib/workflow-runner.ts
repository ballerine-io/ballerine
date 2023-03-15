import { uniqueArray } from '@ballerine/common';
import * as jsonLogic from 'json-logic-js';
import type { ActionFunction, MachineOptions, StateMachine } from 'xstate';
import { createMachine, interpret } from 'xstate';
import { HttpError } from './errors';
import type {
  ObjectValues,
  WorkflowEvent,
  WorkflowEventWithoutState,
  WorkflowExtensions,
  WorkflowRunnerArgs,
} from './types';
import { Error as ErrorEnum } from './types';

export class WorkflowRunner {
  #__subscription: Array<(event: WorkflowEvent) => void> = [];
  #__workflow: StateMachine<any, any, any>;
  #__currentStateNode: any;
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
    this.#__workflow = this.#__extendedWorkflow({
      definition,
      workflowActions,
      extensions,
    });

    // use initial context or provided context
    this.#__context =
      workflowContext && Object.keys(workflowContext.machineContext ?? {})?.length
        ? workflowContext.machineContext
        : definition.context || {};

    // use initial state or provided state
    this.#__currentState = workflowContext?.state ? workflowContext.state : definition.initial;

    // global and state specific extensions
    this.#__extensions = extensions || { statePlugins: [] };
    this.#__debugMode = debugMode;
  }

  #__extendedWorkflow({
    definition,
    workflowActions,
    extensions = {
      statePlugins: [],
    },
  }: {
    definition: any;
    workflowActions?: WorkflowRunnerArgs['workflowActions'];
    extensions?: WorkflowExtensions;
  }) {
    const onEnter: string[] = [];
    const onExit: string[] = [];
    const stateActions: Record<string, ActionFunction<any, any>> = {};

    for (const state in definition.states) {
      definition.states[state].entry = uniqueArray([
        ...(definition.states[state].entry ?? []),
        ...onEnter,
      ]);

      definition.states[state].exit = uniqueArray([
        ...(definition.states[state].exit ?? []),
        ...onExit,
      ]);
    }

    for (const statePlugin of extensions.statePlugins) {
      const when = statePlugin.when === 'pre' ? 'entry' : 'exit';

      for (const stateName of statePlugin.stateNames) {
        if (!definition.states[stateName]) {
          throw new Error(`${stateName} is not defined within the workflow definition's states`);
        }

        // E.g { state: { entry: [...,plugin.name] } }
        definition.states[stateName][when] = uniqueArray([
          ...(definition.states[stateName][when] ?? []),
          statePlugin.name,
        ]);

        // Blocking plugins are not injected as actions
        if (statePlugin.isBlocking || stateActions[statePlugin.name]) {
          continue;
        }
        // workflow-core
        // { actions: { persist: action } }
        stateActions[statePlugin.name] = async (context, event) => {
          this.#__callback?.({
            type: 'STATE_ACTION_STATUS',
            state: this.#__currentState,
            payload: {
              status: 'PENDING',
              action: statePlugin.name,
            },
          });

          try {
            await statePlugin.action({
              workflowId: '',
              context,
              event,
              state: this.#__currentState,
            });

            this.#__callback?.({
              type: 'STATE_ACTION_STATUS',
              state: this.#__currentState,
              payload: {
                status: 'SUCCESS',
                action: statePlugin.name,
              },
            });
          } catch (err) {
            let type: ObjectValues<typeof ErrorEnum> = ErrorEnum.ERROR;

            if (err instanceof HttpError) {
              type = ErrorEnum.HTTP_ERROR;
            }

            this.#__callback?.({
              type: 'STATE_ACTION_STATUS',
              state: this.#__currentState,
              payload: {
                status: 'ERROR',
                action: statePlugin.name,
              },
              error: err,
            });

            this.#__callback?.({
              type,
              state: this.#__currentState,
              error: err,
            });
          }
        };
      }
    }

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

    return createMachine({ predictableActionArguments: false, ...definition }, { actions, guards });
  }

  async sendEvent(event: WorkflowEventWithoutState) {
    const workflow = this.#__workflow.withContext(this.#__context);
    console.log('Current state:', this.#__currentState);

    const service = interpret(workflow)
      .start(this.#__currentState)
      .onTransition(state => {
        if (state.changed) {
          console.log('Transitioned into', state.value);

          if (state.configuration?.[0]?.['type'] == 'final') {
            console.log('Reached final state');
          }

          if (this.#__callback) {
            // TODO: clean it up
            const name = state.configuration?.[0]?.['key'] ?? '';

            this.#__callback({
              ...event,
              state: name,
            });
          }
        }

        this.#__currentStateNode = state;
        this.#__currentState = state.value;
      });

    // all sends() will be deferred until the workflow is started
    service.start();

    for (const ext of this.#__extensions.statePlugins) {
      if (!ext.isBlocking || ext.when !== 'pre') {
        // Non blocking plugins are executed as actions
        continue;
      }

      const snapshot = service.getSnapshot();
      await ext.action({
        workflowId: snapshot.machine?.id || '',
        context: snapshot.context,
        event,
        state: this.#__currentStateNode,
      });
    }
    service.send(event);
    this.#__context = service.getSnapshot().context;
    if (this.#__debugMode) {
      console.log('context:', this.#__context);
    }

    for (const ext of this.#__extensions.statePlugins) {
      if (!ext.isBlocking || ext.when !== 'post') {
        // Non blocking plugins are executed as actions
        continue;
      }

      const snapshot = service.getSnapshot();

      await ext.action({
        workflowId: snapshot.machine?.id || '',
        context: this.#__context,
        event,
        state: this.#__currentStateNode,
      });
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
