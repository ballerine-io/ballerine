import { Business, EndUser, Prisma, PrismaClient } from '@prisma/client';

export const kybWithExternalRequestWorkflowExample = {
  id: 'external_request_example',
  name: 'external_request_example',
  version: 1,
  definitionType: 'statechart-json',
  definition: {
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
                rule: {
                  '==': [
                    { var: 'context.entity.companyName' },
                    { var: 'response.data.registered_name' },
                  ],
                },
              },
            },
            {
              // company dosent match but similar
              target: 'manual_review',
              cond: {
                type: 'json-logic',
                options: {
                  rule: {
                    '>': [
                      { var: 'context.external_request_example.data.name_fuzziness_score' },
                      0.5,
                    ],
                  },
                  onFailed: { manualReviewReason: 'name not matching ... ' },
                },
              },
            },
            {
              // company dosent match but similar
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
        type: 'final',
      },
      auto_reject: {
        type: 'final',
      },
      approve: {
        type: 'final',
      },
      revision: {
        on: {
          data_updated: 'check_business_details',
        },
      },
    },
  },
  extensions: {
      apiPlugins: [
        {
          name: 'external_request_example',
          strategy: 'direct-api',
          url: 'https://simple-kyb-demo.s3.eu-central-1.amazonaws.com/mock-data/business_test_eu.json',
          method: 'GET',
          stateNames: ['check_business_details'],
          successAction: 'API_CALL_SUCCESS',
          errorAction: 'API_CALL_ERROR',
          request: {
            transform: {
              transformer: 'jq',
              mapping:
                '{ business_name: .context .entity .companyName, regestration_number:  .context .entity .registrationNumber}',
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
            transform: '{.}', // JQ
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
          states: ['check_company_data'],
        },
        {
          name: 'ballerineEnrichment',
          url: 'https://webhook.site/#!/9cc6adb9-6409-4955-95c7-cb02b9a8e9a1',
          method: 'GET',
          stateNames: ['success', 'type'],
          request: {
            transform: {
              transformer: 'jq',
              mapping: '{.entity}'
            },
          },
        },
      ]
    },
  };
export const generateDefinitionForE2eTest = async() => {
  const client = new PrismaClient();
  return await client.workflowDefinition.create({ data: kybWithExternalRequestWorkflowExample});
}
