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
                    '==': [
                      { var: 'entity.data.companyName' },
                      {
                        var: 'pluginsOutput.business_data_vendor.business_details.registered_name',
                      },
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
                      { var: 'pluginsOutput.business_data_vendor.name_fuzziness_score' },
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
        logo: 'https://uploads-ssl.webflow.com/62a3bad46800eb4715b2faf1/649435882f9b2819873035d7_companyVendorLogo.png',
        url: 'https://simple-kyb-demo.s3.eu-central-1.amazonaws.com/mock-data/{api_config.url_endpoint}.json',
        method: 'GET',
        stateNames: ['check_business_details'],
        successAction: 'API_CALL_SUCCESS',
        errorAction: 'API_CALL_ERROR',
        request: {
          transform: {
            transformer: 'jq',
            mapping:
              '{ business_name: .entity .data .companyName, registration_number: .entity .data .registrationNumber}',
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
      },
      {
        name: 'finish_webhook',
        url: 'https://webhook.site/9cc6adb9-6409-4955-95c7-cb02b9a8e9a1',
        method: 'POST',
        stateNames: ['auto_approve', 'approve', 'reject'],
        headers: {
          authorization: 'Bearer {secret.BUSINESS_DATA__VENDOR_API_KEY}',
        },
        request: {
          transform: {
            transformer: 'jq',
            mapping: '{apiOutput: .pluginsOutput .business_data_vendor}',
          },
        },
      },
      {
        name: 'fail_webhook',
        url: 'https://webhook.site/9cc6adb9-6409-4955-95c7-cb02b9a8e9a1',
        method: 'POST',
        stateNames: ['auto_reject'],
        request: {
          transform: {
            transformer: 'jq',
            mapping: '{failing_result: .}',
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
