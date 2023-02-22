import {
  createMachine,
  interpret,
  MachineConfig,
  MachineOptions,
  StateMachine
} from 'xstate';
import * as jsonLogic from 'json-logic-js';

import {
  WorkflowEvent,
  WorkflowEventWithoutState,
  WorkflowExtensions,
} from '..';

interface WorkflowRunnerArgs {
  workflowDefinition: MachineConfig<any, any, any>;
  context: any;
  state?: string;
  extensions?: WorkflowExtensions;
}

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
    {workflowDefinition, context = {}, state, extensions}: WorkflowRunnerArgs,
    debugMode = true
  ) {
    this.#__workflow = this.#__extendedWorkflow({
      workflow: workflowDefinition,
      extensions
    });

    // use initial context or provided context
    this.#__context = Object.keys(context).length
      ? context
      : workflowDefinition.context || {};

    //use initial state or provided state
    this.#__currentState = state ? state : workflowDefinition.initial;

    // global and state specific extensions
    this.#__extensions = extensions || {globalPlugins: [], statePlugins: []};
    this.#__debugMode = debugMode;
  }

  #__extendedWorkflow({
                        workflow,
                        extensions = {
                          statePlugins: [],
                          globalPlugins: [],
                        }
                      }: {
    workflow: any;
    extensions?: WorkflowExtensions;
  }) {
    const extended = workflow;
    const onEnter = ['ping'];
    const onExit = ['pong'];

    for (const state in extended.states) {

      extended.states[state].entry = [
        ...new Set([
          ...(workflow.states[state].entry ?? []),
          ...onEnter
        ])
      ];

      extended.states[state].exit = [
        ...new Set([
          ...(workflow.states[state].exit ?? []),
          ...onExit
        ])
      ];


    }

    const actions: MachineOptions<any, any>['actions'] = {
      ping: (...rest: any[]) => {
        console.log('Global state entry handler');
      },
      pong: (...rest: any[]) => {
        console.log('Global state exit handler');
      },
    };

    const guards: MachineOptions<any, any>['guards'] = {
      'json-rule': (ctx, {payload}, {cond}) => {
        const data = {...ctx, ...payload};
        return jsonLogic.apply(
          cond.name, // Rule
          data // Data
        );
      },
    };

    return createMachine(
      {predictableActionArguments: false, ...extended},
      {actions, guards}
    );
  }

  async sendEvent(event: WorkflowEventWithoutState) {
    const workflow = this.#__workflow.withContext(this.#__context);
    console.log('Current state:', this.#__currentState);

    const service = interpret(workflow)
      .start(this.#__currentState)
      .onTransition((state) => {
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

    for (const ext of this.#__extensions.globalPlugins) {
      if (ext.when == 'pre') {
        await ext.action({
          context: service.getSnapshot().context,
          event,
          currentState: this.#__currentStateNode
        });
      }
    }
    service.send(event);
    this.#__context = service.getSnapshot().context;
    if (this.#__debugMode) {
      console.log('context:', this.#__context);
    }

    for (const ext of this.#__extensions.globalPlugins) {
      if (ext.when == 'post') {
        await ext.action({
          context: this.#__context,
          event,
          currentState: this.#__currentStateNode
        });
      }
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
