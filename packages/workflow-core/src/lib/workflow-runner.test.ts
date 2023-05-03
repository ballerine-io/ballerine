import { beforeEach, describe, expect, it, test } from 'vitest';
import { WorkflowRunner } from './workflow-runner';

const DEFAULT_PAYLOAD = { payload: { some: 'payload' } };

const SINGLE_STATE_MACHINE_DEFINITION = {
  initial: 'initial',
  states: {
    initial: {
      on: { EVENT: 'initial' },
    },
  },
};

const TWO_STATES_MACHINE_DEFINITION = {
  initial: 'initial',
  states: {
    initial: {
      on: { EVENT: 'final' },
    },
    final: {
      on: { EVENT: 'initial' },
    },
  },
};

function EventCollectingWorkflow(args) {
  var wf = new WorkflowRunner(args);
  wf.events = [];
  wf.subscribe(event => wf.events.push(event));
  return wf;
}

function promisedSetTimeout() {
  if (arguments.length == 2) {
    var callback = arguments[0];
    var ms = arguments[1];
  } else {
    var callback = Function();
    var ms = arguments[0];
  }

  return new Promise(resolve => {
    setTimeout(() => {
      callback();
      resolve();
    }, ms);
  });
}

describe('workflow-runner', () => {
  it('does not invoke subscribe callback for an unsubscribed event', () => {
    var wf = EventCollectingWorkflow({
      definition: SINGLE_STATE_MACHINE_DEFINITION,
    });

    wf.sendEvent({ type: 'UnregisteredEvent', ...DEFAULT_PAYLOAD });

    expect(wf.events).toStrictEqual([]);
  });

  it('it does not invoke subscribe callback when staying at the same state', () => {
    var wf = EventCollectingWorkflow({
      definition: SINGLE_STATE_MACHINE_DEFINITION,
    });

    wf.sendEvent({ type: 'EVENT', ...DEFAULT_PAYLOAD });

    expect(wf.events).toStrictEqual([]);
  });

  it('invokes subscribe callback when changing state', () => {
    var wf = EventCollectingWorkflow({
      definition: TWO_STATES_MACHINE_DEFINITION,
    });

    wf.sendEvent({ type: 'EVENT', ...DEFAULT_PAYLOAD });

    expect(wf.events).toStrictEqual([{ type: 'EVENT', state: 'final', ...DEFAULT_PAYLOAD }]);
  });

  it('allows to send an event without a payload', () => {
    var wf = EventCollectingWorkflow({
      definition: TWO_STATES_MACHINE_DEFINITION,
    });

    wf.sendEvent({ type: 'EVENT' });

    expect(wf.events).toStrictEqual([{ type: 'EVENT', state: 'final' }]);
  });

  it('does not fail on state changes without a subscribe callback', () => {
    var wf = new WorkflowRunner({
      definition: TWO_STATES_MACHINE_DEFINITION,
    });

    wf.sendEvent({ type: 'EVENT', ...DEFAULT_PAYLOAD });
  });

  it('ignores definition.initial state when workflowContext.state is defined', () => {
    var wf = EventCollectingWorkflow({
      definition: {
        initial: 'initial',
        states: {
          initial: {
            on: { EVENT: 'final' },
          },
          final: {
            on: { EVENT: 'initial' },
          },
          alternative_initial: {
            on: { EVENT: 'alternative_final' },
          },
          alternative_final: {
            on: { EVENT: 'alternative_initial' },
          },
        },
      },
      workflowContext: { state: 'alternative_initial' },
    });

    wf.sendEvent({ type: 'EVENT', ...DEFAULT_PAYLOAD });

    expect(wf.events).toStrictEqual([
      { type: 'EVENT', state: 'alternative_final', ...DEFAULT_PAYLOAD },
    ]);
  });

  it('uses the last subscribed callback', () => {
    var wf = new WorkflowRunner({
      definition: TWO_STATES_MACHINE_DEFINITION,
    });

    var events = [];
    wf.subscribe(event => events.push(event));
    wf.subscribe(event => {});
    wf.sendEvent({ type: 'EVENT', ...DEFAULT_PAYLOAD });

    expect(events).toStrictEqual([]);
  });

  describe('transition plugins', () => {
    describe('non blocking', () => {
      it('allows to keep track of plugins running status using the callback', async () => {
        var wf = EventCollectingWorkflow({
          definition: {
            initial: 'initial',
            states: {
              initial: {
                on: { EVENT: { target: 'final', actions: 'SuccessfulPlugin' } },
              },
              final: {
                on: { EVENT: { target: 'initial', actions: 'FailingPlugin' } },
              },
            },
          },
          extensions: {
            statePlugins: [
              {
                name: 'SuccessfulPlugin',
                stateNames: ['final'],
                action: () => {},
              },
              {
                name: 'FailingPlugin',
                stateNames: ['initial'],
                action: () => {
                  throw new Error('some error');
                },
              },
            ],
          },
        });

        await wf.sendEvent({ type: 'EVENT', ...DEFAULT_PAYLOAD });
        await promisedSetTimeout(1);

        wf.events.forEach(e => {
          e.error && (e.error = e.error.message);
        });
        expect(wf.events).toStrictEqual([
          {
            payload: {
              action: 'FailingPlugin',
              status: 'PENDING',
            },
            state: 'initial',
            type: 'STATE_ACTION_STATUS',
          },
          {
            error: 'some error',
            payload: {
              action: 'FailingPlugin',
              status: 'ERROR',
            },
            state: 'initial',
            type: 'STATE_ACTION_STATUS',
          },
          {
            error: 'some error',
            state: 'initial',
            type: 'ERROR',
          },
          {
            payload: {
              action: 'SuccessfulPlugin',
              status: 'PENDING',
            },
            state: 'initial',
            type: 'STATE_ACTION_STATUS',
          },
          {
            payload: {
              some: 'payload',
            },
            state: 'final',
            type: 'EVENT',
          },
          {
            payload: {
              action: 'SuccessfulPlugin',
              status: 'SUCCESS',
            },
            state: 'final',
            type: 'STATE_ACTION_STATUS',
          },
        ]);
      });

      it('runs plugins in an async manner', async () => {
        var wf = EventCollectingWorkflow({
          definition: TWO_STATES_MACHINE_DEFINITION,
          extensions: {
            statePlugins: [
              {
                name: 'PostInitial',
                when: 'post',
                stateNames: ['initial'],
                action: () => {
                  return promisedSetTimeout(() => wf.events.push('post initial'), 3);
                },
              },
              {
                name: 'PreFinal',
                when: 'pre',
                stateNames: ['final'],
                action: () => {
                  return promisedSetTimeout(() => wf.events.push('pre final'), 1);
                },
              },
            ],
          },
        });

        await wf.sendEvent({ type: 'EVENT', ...DEFAULT_PAYLOAD });

        expect(wf.events).toStrictEqual([
          {
            payload: {
              action: 'PostInitial',
              status: 'PENDING',
            },
            state: 'initial',
            type: 'STATE_ACTION_STATUS',
          },
          {
            payload: {
              action: 'PreFinal',
              status: 'PENDING',
            },
            state: 'initial',
            type: 'STATE_ACTION_STATUS',
          },
          {
            payload: {
              some: 'payload',
            },
            state: 'final',
            type: 'EVENT',
          },
        ]);

        await promisedSetTimeout(5);

        expect(wf.events).toStrictEqual([
          {
            payload: {
              action: 'PostInitial',
              status: 'PENDING',
            },
            state: 'initial',
            type: 'STATE_ACTION_STATUS',
          },
          {
            payload: {
              action: 'PreFinal',
              status: 'PENDING',
            },
            state: 'initial',
            type: 'STATE_ACTION_STATUS',
          },
          {
            payload: {
              some: 'payload',
            },
            state: 'final',
            type: 'EVENT',
          },
          'pre final',
          {
            payload: {
              action: 'PreFinal',
              status: 'SUCCESS',
            },
            state: 'final',
            type: 'STATE_ACTION_STATUS',
          },
          'post initial',
          {
            payload: {
              action: 'PostInitial',
              status: 'SUCCESS',
            },
            state: 'final',
            type: 'STATE_ACTION_STATUS',
          },
        ]);
      });

      it.each(['pre', 'post'])(
        'raises an exception if any of stateNames is not defined',
        async when => {
          expect(() => {
            var wf = new WorkflowRunner({
              definition: TWO_STATES_MACHINE_DEFINITION,
              extensions: {
                statePlugins: [
                  {
                    name: 'PostInitial',
                    when,
                    stateNames: ['initial', 'middle', 'final'],
                  },
                ],
              },
            });
          }).toThrowError("middle is not defined within the workflow definition's states");
        },
      );
    });

    describe('blocking', () => {
      it('does not allow to keep track of plugins running status using the callback', async () => {
        var wf = EventCollectingWorkflow({
          definition: {
            initial: 'initial',
            states: {
              initial: {
                on: { EVENT: { target: 'final' } },
              },
              final: {
                on: { EVENT: { target: 'initial' } },
              },
            },
          },
          extensions: {
            statePlugins: [
              {
                name: 'SuccessfulPlugin',
                isBlocking: true,
                stateNames: ['final'],
                action: () => {},
              },
              {
                name: 'FailingPlugin',
                isBlocking: true,
                stateNames: ['initial'],
                action: () => {
                  throw new Error();
                },
              },
            ],
          },
        });

        await wf.sendEvent({ type: 'EVENT', ...DEFAULT_PAYLOAD });
        await promisedSetTimeout(1);

        expect(wf.events).toStrictEqual([
          {
            payload: {
              some: 'payload',
            },
            state: 'final',
            type: 'EVENT',
          },
        ]);
      });

      it('runs plugins in a sync manner', async () => {
        var wf = EventCollectingWorkflow({
          definition: TWO_STATES_MACHINE_DEFINITION,
          extensions: {
            statePlugins: [
              {
                name: 'PostInitial',
                isBlocking: true,
                when: 'post',
                stateNames: ['initial'],
                action: () => {
                  return promisedSetTimeout(() => wf.events.push('post initial'), 3);
                },
              },
              {
                name: 'PreFinal',
                isBlocking: true,
                when: 'pre',
                stateNames: ['final'],
                action: () => {
                  return promisedSetTimeout(() => wf.events.push('pre final'), 1);
                },
              },
            ],
          },
        });

        await wf.sendEvent({ type: 'EVENT', ...DEFAULT_PAYLOAD });
        await promisedSetTimeout(3);

        expect(wf.events).toStrictEqual([
          {
            payload: {
              action: 'PostInitial',
              status: 'PENDING',
            },
            state: 'initial',
            type: 'STATE_ACTION_STATUS',
          },
          'post initial',
          {
            payload: {
              action: 'PostInitial',
              status: 'SUCCESS',
            },
            state: 'initial',
            type: 'STATE_ACTION_STATUS',
          },
          {
            payload: {
              some: 'payload',
            },
            state: 'final',
            type: 'EVENT',
          },
          {
            payload: {
              action: 'PreFinal',
              status: 'PENDING',
            },
            state: 'final',
            type: 'STATE_ACTION_STATUS',
          },
          'pre final',
          {
            payload: {
              action: 'PreFinal',
              status: 'SUCCESS',
            },
            state: 'final',
            type: 'STATE_ACTION_STATUS',
          },
        ]);
      });
    });
  });

  it('allows to pass state actions', () => {
    var done = false;
    var wf = new WorkflowRunner({
      definition: {
        initial: 'initial',
        states: {
          initial: {
            on: { EVENT: { target: 'final', actions: ['markDone'] } },
          },
          final: {
            on: { EVENT: { target: 'initial', actions: [] } },
          },
        },
      },
      workflowActions: {
        markDone: () => {
          done = true;
        },
      },
    });

    wf.sendEvent({ type: 'EVENT', ...DEFAULT_PAYLOAD });

    expect(done).toEqual(true);
  });
});
