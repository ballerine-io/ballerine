import { beforeEach, afterEach, describe, expect, it, test } from 'vitest';
import { WorkflowRunner } from '../../workflow-runner';
import { sleep } from '@ballerine/common';

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
  describe('api plugins', () => {
    const apiPluginsSchemas = [
      {
        name: 'ballerineEnrichment',
        url: 'https://simple-kyb-demo.s3.eu-central-1.amazonaws.com/mock-data/business_test_us.json',
        method: 'GET',
        stateNames: ['checkBusinessScore'],
        successAction: 'API_CALL_SUCCESS',
        errorAction: 'API_CALL_FAILURE',
        request: {
          transform: {
            transformer: 'jq',
            transformationLogic: '{saleforce_id: .context.machineContext.entity.id}',
          },
        },
        response: {
          transform: { transformer: 'jq', transformationLogic: '{.: .ballerineEnrichment}' },
        },
      },
    ];
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

      const workflow = new WorkflowRunner({
        definition,
        extensions: {
          externalPlugins: { apiPluginsSchemas },
        },
        workflowContext: { machineContext: { entity: { id: 'some_id' } } },
      });

      await workflow.sendEvent('CHECK_BUSINESS_SCORE');

      await sleep(2);

      expect(results).toEqual(['success']);
    });
  });
});
