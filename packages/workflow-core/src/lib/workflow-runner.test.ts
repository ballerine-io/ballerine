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
  const wf = new WorkflowRunner(args);
  wf.events = [];
  wf.subscribe(e => {
    e.error && (e.error = e.error.message);
    wf.events.push(e);
  });
  return wf;
}

const sleep = ms => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
};

describe('workflow-runner', () => {
  it('does not invoke subscribe callback for an unsubscribed event', () => {
    const wf = EventCollectingWorkflow({
      definition: SINGLE_STATE_MACHINE_DEFINITION,
    });

    wf.sendEvent({ type: 'UnregisteredEvent', ...DEFAULT_PAYLOAD });

    expect(wf.events).toStrictEqual([]);
  });

  it('it does not invoke subscribe callback when staying at the same state', () => {
    const wf = EventCollectingWorkflow({
      definition: SINGLE_STATE_MACHINE_DEFINITION,
    });

    wf.sendEvent({ type: 'EVENT', ...DEFAULT_PAYLOAD });

    expect(wf.events).toStrictEqual([]);
  });

  it('invokes subscribe callback when changing state', () => {
    const wf = EventCollectingWorkflow({
      definition: TWO_STATES_MACHINE_DEFINITION,
    });

    wf.sendEvent({ type: 'EVENT', ...DEFAULT_PAYLOAD });

    expect(wf.events).toStrictEqual([{ type: 'EVENT', state: 'final', ...DEFAULT_PAYLOAD }]);
  });

  it('allows to send an event without a payload', () => {
    const wf = EventCollectingWorkflow({
      definition: TWO_STATES_MACHINE_DEFINITION,
    });

    wf.sendEvent({ type: 'EVENT' });

    expect(wf.events).toStrictEqual([{ type: 'EVENT', state: 'final' }]);
  });

  it('does not fail on state changes without a subscribe callback', () => {
    const wf = new WorkflowRunner({
      definition: TWO_STATES_MACHINE_DEFINITION,
    });

    wf.sendEvent({ type: 'EVENT', ...DEFAULT_PAYLOAD });
  });

  it('ignores definition.initial state when workflowContext.state is defined', () => {
    const wf = EventCollectingWorkflow({
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
    const wf = new WorkflowRunner({
      definition: TWO_STATES_MACHINE_DEFINITION,
    });

    const events = [];
    wf.subscribe(event => events.push(event));
    wf.subscribe(event => {});
    wf.sendEvent({ type: 'EVENT', ...DEFAULT_PAYLOAD });

    expect(events).toStrictEqual([]);
  });

  describe('transition plugins', () => {
    describe('non blocking', () => {
      it('does not allow to keep track of plugins running status using the callback', async () => {
        const wf = EventCollectingWorkflow({
          definition: TWO_STATES_MACHINE_DEFINITION,
          extensions: {
            statePlugins: [
              {
                name: 'SuccessfulPlugin',
                when: 'pre',
                stateNames: ['initial'],
                action: () => {},
              },
              {
                name: 'FailingPlugin',
                when: 'pre',
                stateNames: ['initial'],
                action: () => {
                  throw new Error('some error');
                },
              },
            ],
          },
        });

        await wf.sendEvent({ type: 'EVENT', ...DEFAULT_PAYLOAD });
        await sleep(1);

        expect(wf.events).toStrictEqual([
          { type: 'EVENT', payload: { some: 'payload' }, state: 'final' },
        ]);
      });

      it('does not fail transitions', async () => {
        const wf = EventCollectingWorkflow({
          definition: TWO_STATES_MACHINE_DEFINITION,
          extensions: {
            statePlugins: [
              {
                name: 'FailingPrePlugin',
                when: 'pre',
                stateNames: ['initial'],
                action: () => {
                  throw new Error();
                },
              },
            ],
          },
        });

        await wf.sendEvent({ type: 'EVENT', ...DEFAULT_PAYLOAD });
        await sleep(1);

        expect(wf.events).toStrictEqual([
          { type: 'EVENT', payload: { some: 'payload' }, state: 'final' },
        ]);
      });

      it('raises an exception if any of stateNames is not defined', async => {
        expect(() => {
          const wf = new WorkflowRunner({
            definition: TWO_STATES_MACHINE_DEFINITION,
            extensions: {
              statePlugins: [
                {
                  name: 'PostInitial',
                  when: 'pre',
                  stateNames: ['initial', 'middle', 'final'],
                },
              ],
            },
          });
        }).toThrowError("middle is not defined within the workflow definition's states");
      });
    });

    describe('blocking', () => {
      it('allows to keep track of plugins running status using the callback', async () => {
        const wf = EventCollectingWorkflow({
          definition: TWO_STATES_MACHINE_DEFINITION,
          extensions: {
            statePlugins: [
              {
                name: 'SuccessfulPlugin',
                when: 'pre',
                isBlocking: true,
                stateNames: ['initial'],
                action: async () => {},
              },
              {
                name: 'FailingPlugin',
                when: 'pre',
                isBlocking: true,
                stateNames: ['initial'],
                action: async () => {
                  throw new Error('some error');
                },
              },
            ],
          },
        });

        await wf.sendEvent({ type: 'EVENT', ...DEFAULT_PAYLOAD });
        await sleep(1);

        expect(wf.events).toStrictEqual([
          {
            type: 'STATE_ACTION_STATUS',
            state: 'initial',
            payload: { status: 'PENDING', action: 'SuccessfulPlugin' },
          },
          {
            type: 'STATE_ACTION_STATUS',
            state: 'initial',
            payload: { status: 'SUCCESS', action: 'SuccessfulPlugin' },
          },
          {
            type: 'STATE_ACTION_STATUS',
            state: 'initial',
            payload: { status: 'PENDING', action: 'FailingPlugin' },
          },
          {
            type: 'STATE_ACTION_STATUS',
            state: 'initial',
            payload: { status: 'ERROR', action: 'FailingPlugin' },
            error: 'some error',
          },
          { type: 'ERROR', state: 'initial', error: 'some error' },
          { type: 'EVENT', payload: { some: 'payload' }, state: 'final' },
        ]);
      });

      it('runs plugins in a sync manner', async () => {
        const wf = EventCollectingWorkflow({
          definition: TWO_STATES_MACHINE_DEFINITION,
          extensions: {
            statePlugins: [
              {
                name: 'PostInitial',
                isBlocking: true,
                when: 'pre',
                stateNames: ['initial'],
                action: async () => sleep(3),
              },
              {
                name: 'PreFinal',
                isBlocking: true,
                when: 'pre',
                stateNames: ['initial'],
                action: async () => sleep(1),
              },
            ],
          },
        });

        await wf.sendEvent({ type: 'EVENT', ...DEFAULT_PAYLOAD });
        await sleep(5);

        expect(wf.events).toStrictEqual([
          {
            type: 'STATE_ACTION_STATUS',
            state: 'initial',
            payload: { status: 'PENDING', action: 'PostInitial' },
          },
          {
            type: 'STATE_ACTION_STATUS',
            state: 'initial',
            payload: { status: 'SUCCESS', action: 'PostInitial' },
          },
          {
            type: 'STATE_ACTION_STATUS',
            state: 'initial',
            payload: { status: 'PENDING', action: 'PreFinal' },
          },
          {
            type: 'STATE_ACTION_STATUS',
            state: 'initial',
            payload: { status: 'SUCCESS', action: 'PreFinal' },
          },
          { type: 'EVENT', payload: { some: 'payload' }, state: 'final' },
        ]);
      });
    });
  });

  it('allows to pass xstate actions', () => {
    let done = false;
    const wf = new WorkflowRunner({
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
