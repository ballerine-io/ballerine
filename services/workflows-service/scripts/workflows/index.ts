import { PrismaClient } from '@prisma/client';
import { StateTag, WorkflowDefinitionVariant } from '@ballerine/common';

export const kybWithExternalRequestWorkflowExample = {
  id: 'kyb_external_request_example',
  name: 'kyb_external_request_example',
  version: 1,
  definitionType: 'statechart-json',
  definition: {
    id: 'kyb_example_external_request_v1',
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
        tags: [StateTag.MANUAL_REVIEW],
        on: {
          approve: 'approve',
          reject: 'reject',
          revision: 'revision',
        },
      },
      auto_approve: {
        tags: [StateTag.APPROVED],
        type: 'final',
      },
      auto_reject: {
        tags: [StateTag.REJECTED],
        type: 'final',
      },
      approve: {
        tags: [StateTag.APPROVED],
        type: 'final',
      },
      revision: {
        tags: [StateTag.REVISION],
        on: {
          data_updated: 'check_business_details',
        },
      },
      reject: {
        tags: [StateTag.REJECTED],
        type: 'final',
      },
    },
  },
  extensions: {
    apiPlugins: [
      {
        name: 'external_request_example',
        strategy: 'direct-api',
        successCallback: 'API_CALL_SUCCESS',
        errorCallback: 'API_CALL_FAILURE',
        url: 'https://mocks.ballerine.dev/api/businesses/risk/{context.entity.regestrationNumber}',
        when: 'pre',
        method: 'POST',
        request: {
          transformers: [
            {
              transformer: 'jmespath',
              mapping:
                '{business_name: context.entity.companyName, regestration_number:  context.entity.registrationNumber}',
            },
          ], // JQ
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
          transformers: [{}], // JQ
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
        stateNames: ['check_company_data'],
      },
    ],
  },
  isPublic: true,
  variant: WorkflowDefinitionVariant.DEFAULT,
};

export const generateKybDefintion = async (prismaClient: PrismaClient) => {
  return await prismaClient.workflowDefinition.create({
    data: kybWithExternalRequestWorkflowExample,
  });
};
