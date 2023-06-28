import { PrismaClient } from '@prisma/client';

export const kybWithDynamicExternalRequestWorkflowExample = {
  id: 'dynamic_external_request_example',
  name: 'dynamic_external_request_example',
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
                options: {
                  rule: {
                    or: [
                      {
                        '==': [
                          { var: 'context.entity.companyName' },
                          { var: 'response.data.registered_name' },
                        ],
                      },
                      // {
                      //   '>=': [
                      //     { var: 'context.external_request_example.data.name_fuzziness_score' },
                      //     0.91,
                      //   ],
                      // },
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
                    '>': [{ var: 'pluginsOutput.business_data_vendor.name_fuzziness_score' }, 0.5],
                  },
                  onFailed: { manualReviewReason: 'name not matching ... ' },
                },
              },
            },
            {
              target: 'auto_reject',
              cond: {
                type: 'json-logic',
                options: {
                  rule: {
                    '<': [
                      { var: 'pluginsOutput.external_request_example.name_fuzziness_score' },
                      0.5,
                    ],
                  },
                  onFailed: { manualReviewReason: 'Fuzzy fail and does not match' },
                },
              },
            },
          ],
          API_CALL_ERROR: [
            {
              target: 'manual_review',
              cond: {
                type: 'json-logic',
                options: {
                  rule: {
                    '>=': [{ var: 'pluginsOutput.business_data_vendor.httpStatus' }, 400],
                  },
                },
              },
            },
            {
              target: 'auto_reject',
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
  },
  extensions: {
    apiPlugins: [
      {
        name: 'business_data_vendor',
        url: 'https://simple-kyb-demo.s3.eu-central-1.amazonaws.com/mock-data/business_test_eu.json',
        logo: 'https://uploads-ssl.webflow.com/62a3bad46800eb4715b2faf1/649435882f9b2819873035d7_companyVendorLogo.png',
        method: 'GET',
        stateNames: ['check_business_details'],
        successAction: 'API_CALL_SUCCESS',
        errorAction: 'API_CALL_ERROR',
        request: {
          transform: {
            transformer: 'jmespath',
            mapping:
              '{ business_name: entity.data.companyName, registration_number: entity.data.registrationNumber}',
          }, // jmespath
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
            transformer: 'jmespath',
            mapping: '@', // jmespath
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
                    type: 'object',
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
      },
      {
        name: 'finish_webhook',
        url: 'https://webhook.site/3c48b14f-1a70-4f73-9385-fab2d0db0db8',
        method: 'POST',
        stateNames: ['auto_approve', 'approve', 'reject'],
        headers: {
          authorization: 'Bearer {secret.BUSINESS_DATA__VENDOR_API_KEY}',
        },
        request: {
          transform: {
            transformer: 'jmespath',
            mapping: '{success_result: pluginsOutput.business_data_vendor}',
          },
        },
      },
      {
        name: 'fail_webhook',
        url: 'https://webhook.site/3c48b14f-1a70-4f73-9385-fab2d0db0db8',
        method: 'POST',
        stateNames: ['auto_reject'],
        request: {
          transform: {
            transformer: 'jmespath',
            mapping: '{failing_result: @}',
          },
        },
      },
    ],
  },
};
export const generateDynamicDefinitionForE2eTest = async (prismaClient: PrismaClient) => {
  return await prismaClient.workflowDefinition.create({
    data: kybWithDynamicExternalRequestWorkflowExample,
  });
};
