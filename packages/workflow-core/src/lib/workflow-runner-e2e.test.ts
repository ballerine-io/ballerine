import { describe, expect, it } from 'vitest';
import {WorkflowRunner} from "./workflow-runner";
import {IApiPluginParams} from "./plugins/external-plugin/api-plugin";
import {WorkflowRunnerArgs} from "./types";
describe('e2e-workflow-runner', () => {
  const definition = {
    id: 'kyb_example_v1',
    predictableActionArguments: true,
    initial: 'idle',
    context: {
      documents: [],
    },
    states: {
      idle: {
        on: {
          start: 'check_business_details',
        },
      },
      check_business_details: {
        on: {
          API_CALL_SUCCESS: [
            {
              target: 'auto_approve',
              cond: {
                type: 'json-logic',
                options: {
                  rule: {
                    '==': [
                      {var: 'entity.companyName'},
                      {var: 'pluginsOutput.external_request_example.business_details.registered_name'},
                    ],
                  },
                },
              },
            },
            {
              target: 'manual_review',
              cond: {
                type: 'json-logic',
                options: {
                  rule: {
                    '>': [
                      { var: 'context.external_request_example.result.name_fuzziness_score' },
                      0.5,
                    ],
                  },
                  onFailed: { manualReviewReason: 'name not matching ... ' },
                },
              },
            },
            {
              target: 'auto_reject',
              cond: {
                type: 'json-logic',
                rule: {
                  '<': [{ var: 'context.external_request_example.data.name_fuzziness_score' }, 0.5],
                },
              },
            },
          ],
          API_CALL_ERROR: [
            {
              target: 'manual_review',
              cond: {
                type: 'json-logic',
                rule: {
                  '>=': [{ var: 'context.external_request_example.httpStatus' }, 400],
                },
              },
            },
          ],
        },
      },
      manual_review: {
        on: {
          approve: 'approve',
          reject: 'reject',
          revision: 'revision',
        },
      },
      auto_approve: {
        type: 'final' as 'final',
      },
      auto_reject: {
        type: 'final' as 'final',
      },
      reject: {
        type: 'final' as 'final',
      },
      approve: {
        type: 'final' as 'final',
      },
      revision: {
        on: {
          data_updated: 'check_business_details',
        },
      },
    },
  }

  const apiPluginsSchemas = [
    {
      name: 'external_request_example',
      url: 'https://simple-kyb-demo.s3.eu-central-1.amazonaws.com/mock-data/business_test_eu.json',
      method: 'GET',
      stateNames: ['check_business_details'],
      successAction: 'API_CALL_SUCCESS',
      errorAction: 'API_CALL_ERROR',
      request: {
        transform: {
          transformer: 'jq',
          mapping: '{ business_name: .entity .companyName, registration_number: .entity .registrationNumber}',
        }, // JQ
        schema: {
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
        }, // Schema is OPTIONAL, but if provided, it will be used to validate the request body
      },
      response: {
        transform: {
          transformer: 'jq',
          mapping: '.', // JQ
        },
        schema: {
          $schema: 'http://json-schema.org/draft-07/schema#',
          type: 'object',
          properties: {
            business_details: {
              type: 'object',
              properties: {
                registered_name: {
                  type: 'string',
                },
                registration_number: {
                  type: 'string',
                },
                address: {
                  type: 'string',
                },
                contact_number: {
                  type: 'string',
                },
              },
            },
            name_fuzziness_score: {
              type: 'number',
              minimum: 0,
              maximum: 1,
            },
          },
        }, // OPTIONAL
      },
      headers: {
        authorization: 'Bearer {secrets.BUSINESS_DATA__VENDOR_API_KEY}',
      },
    },
    {
      name: 'finish_webhook',
      url: 'https://webhook.site/9cc6adb9-6409-4955-95c7-cb02b9a8e9a1',
      method: 'POST',
      stateNames: ['auto_approve', 'auto_reject', 'approve', 'reject'],
      request: {
        transform: {
          transformer: 'jq',
          mapping: '{apiOutput: .pluginsOutput .external_request_example}',
        },
      },
    },
  ]

  function createWorkflowRunner(
    definition: WorkflowRunnerArgs['definition'],
    apiPluginsSchemas: IApiPluginParams[],
    context: any
  ) {
    return new WorkflowRunner({
      definition,
      extensions: {
        apiPlugins: apiPluginsSchemas,
      },
      workflowContext: context,
    });
  }

  describe('when registered name exactly the same', () => {
    it('it auto aprpoves', async () => {
      const context = {
        machineContext: {
          entity: {
            companyName: "TestCorp Ltd",
            registrationNumber: "SomeRegistrationNumber"
          }
        }
      }
      const workflow = createWorkflowRunner(definition, apiPluginsSchemas, context)
      await workflow.sendEvent('start');

      expect(workflow.state).toBe('auto_approve');
    });
  })
})
