/* eslint-disable */

import { afterEach, describe, expect, it } from 'vitest';
import { WorkflowRunner } from './workflow-runner';
import { sleep } from '@ballerine/common';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

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

function createEventCollectingWorkflow(args) {
  const workflow = new WorkflowRunner(args);
  workflow.events = [];
  workflow.subscribe(e => {
    e.error && (e.error = e.error.message);
    workflow.events.push(e);
  });
  return workflow;
}

describe('workflow-runner', () => {
  it('does not invoke subscribe callback for an unsubscribed event', async () => {
    const workflow = createEventCollectingWorkflow({
      definition: SINGLE_STATE_MACHINE_DEFINITION,
    });

    await workflow.sendEvent({ type: 'UnregisteredEvent', ...DEFAULT_PAYLOAD });

    expect(workflow.events).toStrictEqual([]);
  });

  it('it does not invoke subscribe callback when staying at the same state', async () => {
    const workflow = createEventCollectingWorkflow({
      definition: SINGLE_STATE_MACHINE_DEFINITION,
    });

    await workflow.sendEvent({ type: 'EVENT', ...DEFAULT_PAYLOAD });

    expect(workflow.events).toStrictEqual([]);
  });

  it('invokes subscribe callback when changing state', async () => {
    const workflow = createEventCollectingWorkflow({
      definition: TWO_STATES_MACHINE_DEFINITION,
    });

    await workflow.sendEvent({ type: 'EVENT', ...DEFAULT_PAYLOAD });

    expect(workflow.events).toStrictEqual([{ type: 'EVENT', state: 'final', ...DEFAULT_PAYLOAD }]);
  });

  it('allows to send an event without a payload', async () => {
    const workflow = createEventCollectingWorkflow({
      definition: TWO_STATES_MACHINE_DEFINITION,
    });

    await workflow.sendEvent({ type: 'EVENT' });

    expect(workflow.events).toStrictEqual([{ type: 'EVENT', state: 'final' }]);
  });

  it('does not fail on state changes without a subscribe callback', async () => {
    const workflow = new WorkflowRunner({
      definition: TWO_STATES_MACHINE_DEFINITION,
    });

    await workflow.sendEvent({ type: 'EVENT', ...DEFAULT_PAYLOAD });
  });

  it('ignores definition.initial state when workflowContext.state is defined', async () => {
    const workflow = createEventCollectingWorkflow({
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

  it('uses the last subscribed callback', async () => {
    const workflow = new WorkflowRunner({
      definition: TWO_STATES_MACHINE_DEFINITION,
    });

    const events = [];
    workflow.subscribe(event => events.push(event));
    workflow.subscribe(event => {});
    await workflow.sendEvent({ type: 'EVENT', ...DEFAULT_PAYLOAD });

    expect(events).toStrictEqual([]);
  });

  describe('transition plugins', () => {
    describe('non blocking', () => {
      it('does not allow to keep track of plugins running status using the callback', async () => {
        const workflow = createEventCollectingWorkflow({
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

        await workflow.sendEvent({ type: 'EVENT', ...DEFAULT_PAYLOAD });

        expect(workflow.events).toStrictEqual([
          { type: 'EVENT', payload: { some: 'payload' }, state: 'final' },
        ]);
      });

      it('does not fail transitions', async () => {
        const workflow = createEventCollectingWorkflow({
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

        await workflow.sendEvent({ type: 'EVENT', ...DEFAULT_PAYLOAD });

        expect(workflow.events).toStrictEqual([
          { type: 'EVENT', payload: { some: 'payload' }, state: 'final' },
        ]);
      });

      it('raises an exception if any of stateNames is not defined', () => {
        expect(() => {
          new WorkflowRunner({
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
        const workflow = createEventCollectingWorkflow({
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
        const workflow = createEventCollectingWorkflow({
          definition: TWO_STATES_MACHINE_DEFINITION,
          extensions: {
            statePlugins: [
              {
                name: 'PostInitial',
                isBlocking: true,
                when: 'pre',
                stateNames: ['initial'],
                action: () => sleep(3),
              },
              {
                name: 'PreFinal',
                isBlocking: true,
                when: 'pre',
                stateNames: ['initial'],
                action: () => sleep(1),
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

  describe('api plugins', () => {
    const apiPlugins = [
      {
        states: ['checkBusinessScore'],
        successAction: 'API_CALL_SUCCESS',
        errorAction: 'API_CALL_FAILURE',

        url: 'https://www.example.com/api',
        method: 'POST',
      },
    ];

    let server;

    afterEach(() => {
      if (server) {
        server.resetHandlers();
        server.close();
      }
    });

    it('does not support states with a predefined entry action', () => {
      const definition = {
        initial: 'initial',
        states: {
          initial: {},
          checkBusinessScore: {
            entry: 'predefinedEntryAction',
          },
        },
      };

      expect(() => {
        new WorkflowRunner({
          definition,
          extensions: {
            apiPlugins,
          },
        });
      }).toThrowError('api plugins do not support state with a predefined entry action');
    });

    it('allows to define only an endpoint and a simple success action', async () => {
      const results = [];

      const definition = {
        initial: 'initial',
        states: {
          initial: {
            on: {
              CHECK_BUSINESS_SCORE: {
                target: 'checkBusinessScore',
              },
            },
          },
          checkBusinessScore: {
            on: {
              API_CALL_SUCCESS: 'checkBusinessScoreSuccess',
            },
          },
          checkBusinessScoreSuccess: {
            entry: () => {
              results.push('success');
            },
          },
        },
      };

      server = setupServer(
        rest.post('https://www.example.com/api', (req, res, ctx) => {
          return res(ctx.status(200), ctx.json({}));
        }),
      );
      server.listen({ onUnhandledRequest: 'error' });

      const workflow = new WorkflowRunner({
        definition,
        extensions: {
          apiPlugins,
        },
      });

      await workflow.sendEvent('CHECK_BUSINESS_SCORE');
      await sleep(2);

      expect(results).toEqual(['success']);
    });

    it('allows to define only an endpoint and a simple error action', async () => {
      const results = [];

      const definition = {
        initial: 'initial',
        states: {
          initial: {
            on: {
              CHECK_BUSINESS_SCORE: {
                target: 'checkBusinessScore',
              },
            },
          },
          checkBusinessScore: {
            on: {
              API_CALL_FAILURE: 'checkBusinessScoreError',
            },
          },
          checkBusinessScoreError: {
            entry: () => {
              results.push('error');
            },
          },
        },
      };

      server = setupServer(
        rest.post('https://www.example.com/api', (req, res, ctx) => {
          return res(ctx.status(300), ctx.json({}));
        }),
      );
      server.listen({ onUnhandledRequest: 'error' });

      const workflow = new WorkflowRunner({
        definition,
        extensions: {
          apiPlugins,
        },
      });

      await workflow.sendEvent('CHECK_BUSINESS_SCORE');
      await sleep(2);

      expect(results).toEqual(['error']);
    });
  });

  it('allows to pass xstate actions', async () => {
    let done = false;
    const workflow = new WorkflowRunner({
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
