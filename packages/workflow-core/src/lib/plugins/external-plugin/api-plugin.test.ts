import { describe, expect, it } from 'vitest';
import { WorkflowRunner } from '../../workflow-runner';
import { IApiPluginParams } from './api-plugin';
import { WorkflowRunnerArgs } from '../../types';

function createWorkflowRunner(
  definition: WorkflowRunnerArgs['definition'],
  apiPluginsSchemas: IApiPluginParams[],
) {
  return new WorkflowRunner({
    definition,
    extensions: {
      apiPlugins: apiPluginsSchemas,
    },
    workflowContext: { machineContext: { entity: { id: 'some_id' } } },
  });
}

describe('workflow-runner', () => {
  describe('api plugins', () => {
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
            API_CALL_FAILURE: 'testManually',
          },
        },
        checkBusinessScoreSuccess: {
          type: 'final',
        },
        testManually: {
          type: 'final',
        },
      },
    };

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
            mapping: '{data: .entity.id}',
          },
        },
        response: {
          transform: { transformer: 'jq', mapping: '{result: .}' },
        },
      },
    ];

    describe('when api plugin tranforms and makes a request to an external api', () => {
      const workflow = createWorkflowRunner(definition, apiPluginsSchemas);
      it('it transitions to successAction and persist response to context', async () => {
        await workflow.sendEvent('CHECK_BUSINESS_SCORE');

        expect(workflow.state).toEqual('checkBusinessScoreSuccess');
        expect(workflow.context.pluginsOutput).toEqual({
          ballerineEnrichment: {
            result: {
              companyInfo: {
                companyName: 'TestCorp Ltd',
                industry: 'Software',
                location: 'New York, USA',
                country: 'US',
                yearEstablished: 1995,
                numberOfEmployees: 500,
                ceo: 'John Doe',
                products: ['Product A', 'Product B', 'Product C'],
                website: 'www.testcorpltd.com',
              },
            },
          },
        });
      });
    });

    describe('when api invalid jq transformation of request', () => {
      const apiPluginsSchemasCopy = structuredClone(apiPluginsSchemas);
      apiPluginsSchemasCopy[0].request.transform.mapping = 'dsa: .unknwonvalue.id}';
      const workflow = createWorkflowRunner(definition, apiPluginsSchemasCopy);
      // TODO: fix later
      // it('it returns error for transformation and transition to testManually', async () => {
      //   await workflow.sendEvent('CHECK_BUSINESS_SCORE');
      //
      //   expect(workflow.state).toEqual('testManually');
      //   expect(workflow.context.pluginsOutput).toEqual({
      //     ballerineEnrichment: {
      //       error:
      //         'Error transforming data: write EPIPE for transformer mapping: dsa: .unknwonvalue.id}',
      //     },
      //   });
      // });
    });

    describe('when api plugin has schema', () => {
      describe('when api request invalid for schema', () => {
        const apiPluginsSchemasCopy = structuredClone(apiPluginsSchemas);
        apiPluginsSchemasCopy[0].request.schema = {
          $schema: 'http://json-schema.org/draft-07/schema#',
          type: 'object',
          properties: {
            business_name: {
              type: 'string',
            },
            registration_number: {
              type: 'string',
            },
          },
          required: ['business_name', 'registration_number'],
        };
        const workflow = createWorkflowRunner(definition, apiPluginsSchemasCopy);

        it('it returns error for transformation and transition to testManually', async () => {
          await workflow.sendEvent('CHECK_BUSINESS_SCORE');

          expect(workflow.state).toEqual('testManually');
          expect(workflow.context.pluginsOutput).toEqual({
            ballerineEnrichment: {
              error:
                "must have required property 'business_name' | must have required property 'registration_number'",
            },
          });
        });
      });

      describe('when api request valid schema', () => {
        const apiPluginsSchemasCopy = structuredClone(apiPluginsSchemas);
        apiPluginsSchemasCopy[0].request.schema = {
          $schema: 'http://json-schema.org/draft-07/schema#',
          type: 'object',
          properties: {
            data: {
              type: 'string',
            },
          },
          required: ['data'],
        };
        const workflow = createWorkflowRunner(definition, apiPluginsSchemasCopy);

        it('it transitions to successAction and persist success (response) to context', async () => {
          await workflow.sendEvent('CHECK_BUSINESS_SCORE');

          expect(workflow.state).toEqual('checkBusinessScoreSuccess');
          expect(Object.keys(workflow.context.pluginsOutput.ballerineEnrichment)[0]).toEqual(
            'result',
          );
        });
      });
    });
  });
});
