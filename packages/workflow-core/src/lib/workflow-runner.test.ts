import { describe, expect, it } from 'vitest';
import { WorkflowRunner } from './workflow-runner';
import { IErrorWithMessage, sleep } from '@ballerine/common';
import { WorkflowEvents } from './types';

const DEFAULT_PAYLOAD = { payload: { some: 'payload' } };

const SINGLE_STATE_MACHINE_DEFINITION = {
  initial: 'initial',
  states: {
    initial: {
      on: {
        EVENT: 'initial',
        UnregisteredEvent: 'initial',
      },
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

const createEventCollectingWorkflow = (
  eventName: keyof typeof WorkflowEvents,
  args: ConstructorParameters<typeof WorkflowRunner>[0],
) => {
  const workflow = new WorkflowRunner(args);

  workflow.events = [];

  workflow.subscribe(eventName, async event => {
    if (event.error) {
      event.error = (event.error as IErrorWithMessage).message;
    }

    workflow.events.push(event);
  });

  return workflow;
};

describe('workflow-runner', () => {
  it('does not invoke subscribe callback for an unsubscribed event', async () => {
    const workflow = createEventCollectingWorkflow(WorkflowEvents.STATE_UPDATE, {
      runtimeId: '',
      definition: SINGLE_STATE_MACHINE_DEFINITION,
    });

    await workflow.sendEvent({ type: 'UnregisteredEvent', ...DEFAULT_PAYLOAD });

    expect(workflow.events).toStrictEqual([]);
  });

  it('does not invoke subscribe callback when staying at the same state', async () => {
    const workflow = createEventCollectingWorkflow(WorkflowEvents.STATE_UPDATE, {
      runtimeId: '',
      definition: SINGLE_STATE_MACHINE_DEFINITION,
    });

    await workflow.sendEvent({ type: 'EVENT', ...DEFAULT_PAYLOAD });

    expect(workflow.events).toStrictEqual([]);
  });

  it('invokes subscribe callback when changing state', async () => {
    const workflow = createEventCollectingWorkflow(WorkflowEvents.STATE_UPDATE, {
      runtimeId: '',
      definition: TWO_STATES_MACHINE_DEFINITION,
    });

    await workflow.sendEvent({ type: 'EVENT', ...DEFAULT_PAYLOAD });

    expect(workflow.events).toStrictEqual([{ type: 'EVENT', state: 'final', ...DEFAULT_PAYLOAD }]);
  });

  it('allows to send an event without a payload', async () => {
    const workflow = createEventCollectingWorkflow(WorkflowEvents.STATE_UPDATE, {
      runtimeId: '',
      definition: TWO_STATES_MACHINE_DEFINITION,
    });

    await workflow.sendEvent({ type: 'EVENT' });

    expect(workflow.events).toStrictEqual([{ type: 'EVENT', state: 'final' }]);
  });

  it('does not fail on state changes without a subscribe callback', async () => {
    const workflow = new WorkflowRunner({
      runtimeId: '',
      definition: TWO_STATES_MACHINE_DEFINITION,
    });

    await workflow.sendEvent({ type: 'EVENT', ...DEFAULT_PAYLOAD });
  });

  it('ignores definition.initial state when workflowContext.state is defined', async () => {
    const workflow = createEventCollectingWorkflow(WorkflowEvents.STATE_UPDATE, {
      runtimeId: '',
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

    await workflow.sendEvent({ type: 'EVENT', ...DEFAULT_PAYLOAD });

    expect(workflow.events).toStrictEqual([
      { type: 'EVENT', state: 'alternative_final', ...DEFAULT_PAYLOAD },
    ]);
  });

  describe('transition plugins', () => {
    describe('non blocking', () => {
      it('does not allow to keep track of plugins running status using the callback', async () => {
        const workflow = createEventCollectingWorkflow(WorkflowEvents.STATE_UPDATE, {
          runtimeId: '',
          definition: TWO_STATES_MACHINE_DEFINITION,
          extensions: {
            statePlugins: [
              {
                name: 'SuccessfulPlugin',
                when: 'pre',
                stateNames: ['initial'],
                action: async () => {
                  return;
                },
                isBlocking: false,
              },
              {
                name: 'FailingPlugin',
                when: 'pre',
                stateNames: ['initial'],
                isBlocking: false,
                action: () => {
                  throw new Error('some error');
                },
              },
            ],
          },
        });

        await workflow.sendEvent({ type: 'EVENT', ...DEFAULT_PAYLOAD });

        expect(workflow.events).toStrictEqual([
          { type: 'EVENT', payload: { some: 'payload' }, state: 'final' },
        ]);
      });

      it('does not fail transitions', async () => {
        const workflow = createEventCollectingWorkflow(WorkflowEvents.STATE_UPDATE, {
          runtimeId: '',
          definition: TWO_STATES_MACHINE_DEFINITION,
          extensions: {
            statePlugins: [
              {
                name: 'FailingPrePlugin',
                when: 'pre',
                stateNames: ['initial'],
                isBlocking: false,
                action: () => {
                  throw new Error();
                },
              },
            ],
          },
        });

        await workflow.sendEvent({ type: 'EVENT', ...DEFAULT_PAYLOAD });

        expect(workflow.events).toStrictEqual([
          { type: 'EVENT', payload: { some: 'payload' }, state: 'final' },
        ]);
      });

      it('raises an exception if any of stateNames is not defined', () => {
        expect(() => {
          new WorkflowRunner({
            runtimeId: '',
            definition: TWO_STATES_MACHINE_DEFINITION,
            extensions: {
              statePlugins: [
                {
                  name: 'PostInitial',
                  when: 'pre',
                  stateNames: ['initial', 'middle', 'final'],
                  isBlocking: false,
                  action: async () => {
                    return;
                  },
                },
              ],
            },
          });
        }).toThrowError("middle is not defined within the workflow definition's states");
      });
    });

    describe('blocking', () => {
      it('allows to keep track of plugins running status using the callback', async () => {
        const workflow = createEventCollectingWorkflow(WorkflowEvents.STATE_UPDATE, {
          runtimeId: '',
          definition: TWO_STATES_MACHINE_DEFINITION,
          extensions: {
            statePlugins: [
              {
                name: 'SuccessfulPlugin',
                when: 'pre',
                isBlocking: true,
                stateNames: ['initial'],
                action: async () => {
                  return;
                },
              },
              {
                name: 'FailingPlugin',
                when: 'pre',
                isBlocking: true,
                stateNames: ['initial'],
                action: () => {
                  throw new Error('some error');
                },
              },
            ],
          },
        });

        await workflow.sendEvent({ type: 'EVENT', ...DEFAULT_PAYLOAD });

        expect(workflow.events).toStrictEqual([
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
        const workflow = createEventCollectingWorkflow(WorkflowEvents.STATE_UPDATE, {
          runtimeId: '',
          definition: TWO_STATES_MACHINE_DEFINITION,
          extensions: {
            statePlugins: [
              {
                name: 'PostInitial',
                isBlocking: true,
                when: 'pre',
                stateNames: ['initial'],
                action: async () => {
                  await sleep(3);
                },
              },
              {
                name: 'PreFinal',
                isBlocking: true,
                when: 'pre',
                stateNames: ['initial'],
                action: async () => {
                  await sleep(1);
                },
              },
            ],
          },
        });

        await workflow.sendEvent({ type: 'EVENT', ...DEFAULT_PAYLOAD });

        expect(workflow.events).toStrictEqual([
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

  it('allows to pass xstate actions', async () => {
    let done = false;
    const workflow = new WorkflowRunner({
      runtimeId: '',
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

    await workflow.sendEvent({ type: 'EVENT', ...DEFAULT_PAYLOAD });

    expect(done).toEqual(true);
  });
});

describe('Workflows with conditions', () => {
  const createCondMachine = (score: number) =>
    ({
      runtimeId: '',
      workflowContext: {
        machineContext: {
          external_request_example: {
            data: {
              name_fuzziness_score: 0.85, // or whatever value you want to assign
            },
          },
        },
      },
      definition: {
        initial: 'initial',
        states: {
          initial: {
            on: {
              EVENT: [
                {
                  target: 'final',
                  cond: {
                    type: 'json-logic',
                    options: {
                      rule: {
                        '>': [{ var: 'external_request_example.data.name_fuzziness_score' }, score],
                      },
                      assignOnFailure: { manualReviewReason: 'name not matching ... ' },
                    },
                  },
                },
              ],
            },
          },
          middle: {
            on: { EVENT2: { target: 'final', cond: 'isTrue' } },
          },
          final: {
            type: 'final',
          },
        },
      },
    } satisfies ConstructorParameters<typeof WorkflowRunner>[0]);

  it('should not proceed with transition if json logic condition falsy', async () => {
    const workflow = createEventCollectingWorkflow(
      WorkflowEvents.STATE_UPDATE,
      createCondMachine(0.9),
    );
    await workflow.sendEvent({ type: 'EVENT' });
    expect(workflow.events[0].state).toEqual('initial');
  });

  it('should proceed with transition if json logic condition truthy', async () => {
    const workflowArgs = createCondMachine(0.5);
    const workflow = createEventCollectingWorkflow(WorkflowEvents.STATE_UPDATE, workflowArgs);
    await workflow.sendEvent({ type: 'EVENT' });

    expect(workflow.events[0].state).toEqual('final');
    // expect(workflow.#__context).toContain({ manualReviewReason: 'name not matching ... ' });
  });

  it('should proceed with transition if json logic condition truthy, and default transition is set', async () => {
    const workflowArgs = createCondMachine(0.5);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    workflowArgs.definition.states.initial.on.EVENT.push({ target: 'middle' });
    const workflow = createEventCollectingWorkflow(WorkflowEvents.STATE_UPDATE, workflowArgs);
    await workflow.sendEvent({ type: 'EVENT' });

    expect(workflow.events[0].state).toEqual('final');
    // expect(workflow.#__context).toContain({ manualReviewReason: 'name not matching ... ' });
  });

  it('should not proceed with transition if json logic condition truthy, but transition to a default state THIS TEST SHOULD BE REVISIONED', async () => {
    const workflowArgs = createCondMachine(0.9);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    workflowArgs.definition.states.initial.on.EVENT.push({ target: 'middle' });

    const workflow = createEventCollectingWorkflow(WorkflowEvents.STATE_UPDATE, workflowArgs);
    await workflow.sendEvent({ type: 'EVENT' });

    expect(workflow.events[0].state).toEqual('initial');
    // expect(workflow.#__context).toContain({ manualReviewReason: 'name not matching ... ' });
  });
});
