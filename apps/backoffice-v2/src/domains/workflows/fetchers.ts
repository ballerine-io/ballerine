import qs from 'qs';
import { deepCamelKeys } from 'string-ts';
import { z } from 'zod';
import { apiClient } from '../../common/api-client/api-client';
import { Method, States } from '../../common/enums';
import { handleZodError } from '../../common/utils/handle-zod-error/handle-zod-error';
import { ObjectWithIdSchema } from '../../lib/zod/utils/object-with-id/object-with-id';
import { zPropertyKey } from '../../lib/zod/utils/z-property-key/z-property-key';
import { IWorkflowId } from './interfaces';

export const fetchWorkflows = async (params: {
  filterId: string;
  orderBy: string;
  page: {
    number: number;
    size: number;
  };
  filter: Record<string, unknown>;
}) => {
  const queryParams = qs.stringify(params, { encode: false });

  const [workflows, error] = await apiClient({
    endpoint: `workflows?${queryParams}`,
    method: Method.GET,
    schema: z.object({
      data: z.array(
        z.object({
          id: z.string(),
          status: z.string(),
          createdAt: z.string().datetime(),
          entity: ObjectWithIdSchema.extend({
            name: z.string(),
            avatarUrl: z.string().nullable().optional(),
            approvalState: z.enum(States),
          }),
          assignee: ObjectWithIdSchema.extend({
            firstName: z.string(),
            lastName: z.string(),
            avatarUrl: z.string().nullable().optional(),
          }).nullable(),
          tags: z.array(z.string()).nullable().optional(),
        }),
      ),
      meta: z.object({
        totalItems: z.number().nonnegative(),
        totalPages: z.number().nonnegative(),
      }),
    }),
  });

  return handleZodError(error, workflows);
};

export type TWorkflowById = z.output<typeof WorkflowByIdSchema>;

export const BaseWorkflowByIdSchema = z.object({
  id: z.string(),
  status: z.string(),
  state: z.string().nullable(),
  nextEvents: z.array(z.any()),
  tags: z.array(z.string()).nullable().optional(),
  workflowDefinition: ObjectWithIdSchema.extend({
    name: z.string(),
    contextSchema: z.record(z.any(), z.any()).nullable(),
    documentsSchema: z.array(z.any()).optional().nullable(),
    config: z.record(z.any(), z.any()).nullable(),
  }),
  createdAt: z.string().datetime(),
  context: z.object({
    documents: z.array(z.any()).default([]),
    entity: z.record(z.any(), z.any()),
    parentMachine: ObjectWithIdSchema.extend({
      status: z.union([z.literal('active'), z.literal('failed'), z.literal('completed')]),
    }).optional(),
    pluginsOutput: z.record(zPropertyKey, z.any()).optional(),
  }),
  entity: ObjectWithIdSchema.extend({
    name: z.string(),
    avatarUrl: z.string().nullable().optional(),
    approvalState: z.enum(States),
  }),
  assignee: ObjectWithIdSchema.extend({
    firstName: z.string(),
    lastName: z.string(),
    avatarUrl: z.string().nullable().optional(),
  }).nullable(),
});

export const WorkflowByIdSchema = BaseWorkflowByIdSchema.extend({
  childWorkflows: z.array(BaseWorkflowByIdSchema).optional(),
});

export const fetchWorkflowById = async ({
  workflowId,
  filterId,
}: {
  workflowId: string;
  filterId: string;
}) => {
  const [workflow, error] = await apiClient({
    endpoint: `workflows/${workflowId}?filterId=${filterId}`,
    method: Method.GET,
    schema: WorkflowByIdSchema.transform(data => ({
      ...data,
      context: {
        ...data.context,
        pluginsOutput: {
          ...data.context?.pluginsOutput,
          // TODO: Upgrade workflows-service TypeScript version to >= 5 and use `string-ts`'s `deepCamelCase` instead on the server side in `formatWorkflow`.
          // Currently, `nest-access-control` v2.2.0 is incompatible with TypeScript >= 5.
          website_monitoring: {
            ...data.context?.pluginsOutput?.website_monitoring,
            data: deepCamelKeys(data.context?.pluginsOutput?.website_monitoring?.data ?? {}),
          },
        },
      },
      childWorkflows: [
        {
          id: 'clpz8g72n002i2y1tzz3ci00o',
          tags: null,
          state: 'idle',
          status: 'active',
          context: {
            entity: {
              data: {
                country: 'AD',
                companyName: 'Alon Mami',
                additionalInfo: {
                  companyName: 'ReDial z.optional()',
                  customerName: 'PayLink',
                  kybCompanyName: 'ReDial z.optional()',
                  customerCompany: 'PayLink',
                  mainRepresentative: {
                    email: 'nitzan@ballerine.com',
                    lastName: 'dwadwadw',
                    firstName: 'dwadwadwa',
                  },
                  associationRelationship: 'Venture Capital Investor in ReDial z.optional()',
                },
                registrationNumber: '121312',
              },
              type: 'business',
              ballerineEntityId: 'clpz8g719002b2y1tfuho6wwd',
            },
            metadata: {
              token: '8428f69c-4658-4ec1-afaf-771305fd7dbd',
              customerName: 'PayLink',
            },
            customerName: 'PayLink',
          },
          assignee: null,
          createdAt: '2023-12-10T08:38:33.168Z',
          assigneeId: null,
          workflowDefinition: {
            id: 'paylink_child_associated_company',
            name: 'paylink_child_associated_company',
            config: {
              createCollectionFlowToken: true,
            },
            definition: {
              id: 'paylink_child_associated_company_v1',
              states: {
                idle: {
                  on: {
                    START_ASSOCIATED_COMPANY_KYB: 'deliver_associated_company_email',
                  },
                },
                failed: {
                  tags: ['failure'],
                  type: 'final',
                },
                approved: {
                  tags: ['approved'],
                  type: 'final',
                },
                revision: {
                  on: {
                    COLLECTION_FLOW_FINISHED: 'manual_review',
                  },
                  tags: ['revision'],
                },
                manual_review: {
                  on: {
                    approve: 'approved',
                    revision: 'deliver_associated_company_revision_email',
                  },
                  tags: ['manual_review'],
                },
                deliver_associated_company_email: {
                  on: {
                    EMAIL_SENT: [
                      {
                        target: 'pending_associated_kyb_collection_flow',
                      },
                    ],
                    EMAIL_FAILURE: [
                      {
                        target: 'failed',
                      },
                    ],
                  },
                  tags: ['collection_flow'],
                },
                pending_associated_kyb_collection_flow: {
                  on: {
                    COLLECTION_FLOW_FINISHED: [
                      {
                        target: 'manual_review',
                      },
                    ],
                  },
                  tags: ['collection_flow'],
                },
                deliver_associated_company_revision_email: {
                  on: {
                    EMAIL_SENT: [
                      {
                        target: 'revision',
                      },
                    ],
                    EMAIL_FAILURE: [
                      {
                        target: 'failed',
                      },
                    ],
                  },
                  tags: ['revision'],
                },
              },
              initial: 'idle',
              predictableActionArguments: true,
            },
            contextSchema: null,
            documentsSchema: null,
          },
          childWorkflowsRuntimeData: [],
          entity: {
            id: 'clpz8g719002b2y1tfuho6wwd',
            name: 'Alon Mami',
            avatarUrl: null,
            approvalState: 'NEW',
          },
          nextEvents: ['UPDATE_CONTEXT', 'START_ASSOCIATED_COMPANY_KYB'],
          childWorkflows: [],
        },
        {
          id: 'clpz8g72h002g2y1to78zucsn',
          tags: ['manual_review'],
          state: 'manual_review',
          status: 'active',
          context: {
            entity: {
              data: {
                country: 'AS',
                companyName: '412321321321',
                businessType: 'Private Limited Company (Ltd)',
                additionalInfo: {
                  companyName: 'ReDial z.optional()',
                  customerName: 'PayLink',
                  headquarters: {
                    city: 'Ramat-gan',
                    phone: '16858658685',
                    street: 'Krinitsi',
                    country: 'AO',
                    postalCode: '52414',
                    streetNumber: 102,
                  },
                  kybCompanyName: 'ReDial z.optional()',
                  customerCompany: 'PayLink',
                  mainRepresentative: {
                    email: 'alon@ballerine.com',
                    lastName: 'MAMI',
                    firstName: 'ALON',
                  },
                  dateOfEstablishment: '2023-12-12T22:00:00.000Z',
                  associationRelationship: 'Affiliate with ReDial z.optional()',
                },
                registrationNumber: '41321321321',
                taxIdentificationNumber: '68586585',
              },
              type: 'business',
              ballerineEntityId: 'clpz8g71a002c2y1t22dv32mw',
            },
            metadata: {
              token: '83e30a92-9316-442f-a9a7-20e9dfed7cb9',
              customerName: 'PayLink',
            },
            documents: [
              {
                id: 'certificate-of-incorporation',
                type: 'certificate_of_incorporation',
                pages: [
                  {
                    type: 'text/csv',
                    fileName: 'logs-insights-results(9).csv',
                    ballerineFileId: 'clpz8qht4003e2y1tvhmhhi8r',
                  },
                ],
                issuer: {
                  country: 'ZZ',
                },
                version: '1',
                category: 'proof_of_registration',
                decision: {
                  status: null,
                  revisionReason: null,
                  rejectionReason: null,
                },
                properties: {},
                issuingVersion: 1,
                propertiesSchema: {
                  type: 'object',
                  properties: {
                    businessName: {
                      type: 'string',
                    },
                    registrationNumber: {
                      pattern: '^[a-zA-Z0-9]*$',
                      type: 'string',
                    },
                    issueDate: {
                      format: 'date',
                      formatMaximum: '2023-12-17',
                      type: 'string',
                    },
                  },
                },
              },
              {
                id: 'business-utility-bill',
                type: 'business_utility_bill',
                pages: [
                  {
                    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    fileName: 'Certification_Deferred_Hosted.xlsx',
                    ballerineFileId: 'clpz8qeg7003c2y1t9rpvgu3n',
                  },
                ],
                issuer: {
                  country: 'ZZ',
                },
                version: '1',
                category: 'proof_of_ownership',
                decision: {
                  status: null,
                  revisionReason: null,
                  rejectionReason: null,
                },
                properties: {},
                issuingVersion: 1,
                propertiesSchema: {
                  properties: {},
                },
              },
            ],
            flowConfig: {
              apiUrl: 'https://api-dev.eu.ballerine.io',
              tokenId: '83e30a92-9316-442f-a9a7-20e9dfed7cb9',
              appState: 'finish',
              stepsProgress: {
                company_information: {
                  isCompleted: true,
                },
                business_address_information: {
                  isCompleted: true,
                },
              },
              customerCompany: 'PayLink',
            },
            customerName: 'PayLink',
            pluginsOutput: {
              associated_company_email: {},
            },
            workflowRuntimeId: 'clpz8g72h002g2y1to78zucsn',
          },
          assignee: null,
          createdAt: '2023-12-10T08:38:33.158Z',
          assigneeId: null,
          workflowDefinition: {
            id: 'paylink_child_associated_company',
            name: 'paylink_child_associated_company',
            config: {
              createCollectionFlowToken: true,
            },
            definition: {
              id: 'paylink_child_associated_company_v1',
              states: {
                idle: {
                  on: {
                    START_ASSOCIATED_COMPANY_KYB: 'deliver_associated_company_email',
                  },
                },
                failed: {
                  tags: ['failure'],
                  type: 'final',
                },
                approved: {
                  tags: ['approved'],
                  type: 'final',
                },
                revision: {
                  on: {
                    COLLECTION_FLOW_FINISHED: 'manual_review',
                  },
                  tags: ['revision'],
                },
                manual_review: {
                  on: {
                    approve: 'approved',
                    revision: 'deliver_associated_company_revision_email',
                  },
                  tags: ['manual_review'],
                },
                deliver_associated_company_email: {
                  on: {
                    EMAIL_SENT: [
                      {
                        target: 'pending_associated_kyb_collection_flow',
                      },
                    ],
                    EMAIL_FAILURE: [
                      {
                        target: 'failed',
                      },
                    ],
                  },
                  tags: ['collection_flow'],
                },
                pending_associated_kyb_collection_flow: {
                  on: {
                    COLLECTION_FLOW_FINISHED: [
                      {
                        target: 'manual_review',
                      },
                    ],
                  },
                  tags: ['collection_flow'],
                },
                deliver_associated_company_revision_email: {
                  on: {
                    EMAIL_SENT: [
                      {
                        target: 'revision',
                      },
                    ],
                    EMAIL_FAILURE: [
                      {
                        target: 'failed',
                      },
                    ],
                  },
                  tags: ['revision'],
                },
              },
              initial: 'idle',
              predictableActionArguments: true,
            },
            contextSchema: null,
            documentsSchema: null,
          },
          childWorkflowsRuntimeData: [],
          entity: {
            id: 'clpz8g71a002c2y1t22dv32mw',
            name: '412321321321',
            avatarUrl: null,
            approvalState: 'NEW',
          },
          nextEvents: ['UPDATE_CONTEXT', 'approve', 'revision'],
          childWorkflows: [],
        },
        {
          id: 'clpz8g71i002e2y1twrt39u5k',
          tags: ['manual_review'],
          state: 'kyc_manual_review',
          status: 'active',
          context: {
            entity: {
              data: {
                email: 'danielb@ballerine.com',
                lastName: 'MAMIU',
                firstName: 'Alon',
                additionalInfo: {
                  role: 'CTO',
                  companyName: 'ReDial z.optional()',
                  dateOfBirth: '1990-04-11T21:00:00.000Z',
                  customerCompany: 'PayLink',
                },
              },
              type: 'individual',
              ballerineEntityId: 'clpz8g6zl002a2y1tl6xyqjr1',
            },
            documents: [
              {
                id: 'a482d4f9-eb61-4f66-b0c2-22fe4869979a',
                type: 'identification_document',
                pages: [
                  {
                    uri: 'file:///tmp/tmp-65-6GBxnwO90HsG.jpg',
                    type: 'image/jpeg',
                    metadata: {
                      side: 'face-pre',
                    },
                    provider: 'file-system',
                    ballerineFileId: 'clq3ql9gy00103u1twvuna4rv',
                  },
                  {
                    uri: 'file:///tmp/tmp-65-3sVwVnFz7sZH.jpg',
                    type: 'image/jpeg',
                    metadata: {
                      side: 'face',
                    },
                    provider: 'file-system',
                    ballerineFileId: 'clq3ql9il00163u1tihazrgam',
                  },
                  {
                    uri: 'file:///tmp/tmp-65-kONXs54sSny9.jpg',
                    type: 'image/jpeg',
                    metadata: {
                      side: 'front-pre',
                    },
                    provider: 'file-system',
                    ballerineFileId: 'clq3ql9gx000y3u1tmmvpgcoh',
                  },
                  {
                    uri: 'file:///tmp/tmp-65-iJwXePW7ofk5.jpg',
                    type: 'image/jpeg',
                    metadata: {
                      side: 'front',
                    },
                    provider: 'file-system',
                    ballerineFileId: 'clq3ql9hh00123u1t4z5juorn',
                  },
                  {
                    uri: 'file:///tmp/tmp-65-jcPN9vx4LRDh.jpg',
                    type: 'image/jpeg',
                    metadata: {
                      side: 'back',
                    },
                    provider: 'file-system',
                    ballerineFileId: 'clq3ql9i400143u1te44xavhz',
                  },
                  {
                    uri: 'file:///tmp/tmp-65-uPv9HQII9pAQ.jpg',
                    type: 'image/jpeg',
                    metadata: {
                      side: 'back-pre',
                    },
                    provider: 'file-system',
                    ballerineFileId: 'clq3ql9jo00183u1t72yuqq71',
                  },
                ],
                issuer: {
                  city: null,
                  name: null,
                  country: 'IL',
                  additionalInfo: {
                    validFrom: '2017-04-21',
                    firstIssue: null,
                    validUntil: '2026-12-14',
                  },
                },
                category: 'drivers_license',
                decision: {
                  status: 'revision',
                  revisionReason: 'dwadwadaw',
                  rejectionReason: null,
                },
                properties: {
                  idNumber: '305508673',
                  validFrom: '2017-04-21',
                  expiryDate: '2026-12-14',
                  firstIssue: null,
                  validUntil: '2026-12-14',
                },
                issuingVersion: null,
                propertiesSchema: {
                  properties: {},
                },
              },
            ],
            customerName: 'PayLink',
            parentMachine: {
              id: 'clpve7o3a000m2y1ty6c2c600',
              status: 'active',
            },
            pluginsOutput: {
              kyc_session: {
                kyc_session_1: {
                  type: 'kyc',
                  result: {
                    aml: {
                      hits: [],
                      endUserId:
                        '1234567890-clpz8g6zl002a2y1tl6xyqjr1__6de3065f-89d5-4985-968a-630ea6023d01',
                      matchStatus: 'no_match',
                    },
                    entity: {
                      data: {
                        lastName: 'BLOKH',
                        firstName: 'DANIEL',
                        nationalId: '305508673',
                        dateOfBirth: '1990-12-14',
                        additionalInfo: {
                          gender: null,
                          addresses: [],
                          nationality: null,
                          yearOfBirth: null,
                          placeOfBirth: null,
                        },
                      },
                      type: 'individual',
                    },
                    decision: {
                      status: 'approved',
                      riskLabels: [
                        {
                          label:
                            'document_integration_level_crosslinked_with_multiple_vendor_sent_names',
                          category: 'document',
                          sessionIds: ['416a425f-9281-48bf-b948-ceed837ff732'],
                        },
                        {
                          label: 'session_crosslinked_with_person_and_document_photo_mismatch',
                          category: 'crosslinks',
                          sessionIds: [
                            '0d9b7bd5-0e6b-4806-a640-e54c10ab72c8',
                            '77f36c89-74ab-412e-a3ca-3412af916276',
                          ],
                        },
                        {
                          label: 'document_holder_photo_crosslinked_with_multiple_sessions',
                          category: 'document',
                          sessionIds: [
                            '6de3065f-89d5-4985-968a-630ea6023d01',
                            '63085320-7e6e-4f9b-9df6-bd116564f4df',
                            '0d9b7bd5-0e6b-4806-a640-e54c10ab72c8',
                            '77f36c89-74ab-412e-a3ca-3412af916276',
                          ],
                        },
                        {
                          label:
                            'session_vendor_provided_name_not_matching_with_name_on_the_document',
                          category: 'client_data_mismatch',
                          sessionIds: [],
                        },
                        {
                          label:
                            'session_vendor_provided_name_not_similar_with_name_on_the_document',
                          category: 'client_data_mismatch',
                          sessionIds: [],
                        },
                        {
                          label: 'person_previously_approved',
                          category: 'person',
                          sessionIds: [
                            '6de3065f-89d5-4985-968a-630ea6023d01',
                            '63085320-7e6e-4f9b-9df6-bd116564f4df',
                          ],
                        },
                        {
                          label: 'device_previously_approved',
                          category: 'device',
                          sessionIds: [
                            '6de3065f-89d5-4985-968a-630ea6023d01',
                            '63085320-7e6e-4f9b-9df6-bd116564f4df',
                          ],
                        },
                        {
                          label: 'document_previously_approved',
                          category: 'document',
                          sessionIds: [
                            '6de3065f-89d5-4985-968a-630ea6023d01',
                            '63085320-7e6e-4f9b-9df6-bd116564f4df',
                          ],
                        },
                      ],
                      decisionReason: null,
                    },
                    metadata: {
                      id: '80b6c3c9-4f04-4c86-8cc0-22d705567a26',
                      url: 'https://alchemy.veriff.com/v/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDI0Njk3MzEsInNlc3Npb25faWQiOiI4MGI2YzNjOS00ZjA0LTRjODYtOGNjMC0yMmQ3MDU1NjdhMjYiLCJpaWQiOiI5ZTEzOGE1OC0xZWU4LTQzNzctYjE1Yy0xMzNmNDZiNDU0ZmIifQ.03UaKzhSg9UHKnFGIxEmPY1LNf5MQSxK5PbsDQHD2Tk',
                    },
                  },
                  vendor: 'veriff',
                },
              },
            },
            workflowRuntimeId: 'clpz8g71i002e2y1twrt39u5k',
          },
          assignee: null,
          createdAt: '2023-12-10T08:38:33.126Z',
          assigneeId: null,
          workflowDefinition: {
            id: 'paylink_kyc_email_session',
            name: 'paylink_kyc_email_session',
            config: {
              callbackResult: {
                deliverEvent: 'KYC_DONE',
                transformers: [
                  {
                    mapping: '{data: @}',
                    transformer: 'jmespath',
                  },
                ],
              },
            },
            definition: {
              id: 'paylink_kyc_email_session_v1',
              states: {
                idle: {
                  on: {
                    start: 'get_kyc_session',
                  },
                  tags: ['pending_process'],
                },
                approved: {
                  tags: ['approved'],
                  type: 'final',
                },
                rejected: {
                  tags: ['rejected'],
                  type: 'final',
                },
                revision: {
                  tags: ['revision'],
                  always: [
                    {
                      target: 'get_kyc_session_revision',
                    },
                  ],
                },
                email_sent: {
                  on: {
                    KYC_HOOK_RESPONDED: [
                      {
                        target: 'kyc_manual_review',
                      },
                    ],
                  },
                  tags: ['pending_process'],
                },
                get_kyc_session: {
                  on: {
                    SEND_EMAIL: [
                      {
                        target: 'email_sent',
                      },
                    ],
                    API_CALL_ERROR: [
                      {
                        target: 'kyc_auto_reject',
                      },
                    ],
                  },
                  tags: ['pending_process'],
                },
                kyc_auto_reject: {
                  tags: ['rejected'],
                  type: 'final',
                },
                kyc_manual_review: {
                  on: {
                    reject: {
                      target: 'rejected',
                    },
                    approve: {
                      target: 'approved',
                    },
                    revision: {
                      target: 'revision',
                    },
                  },
                  tags: ['manual_review'],
                },
                revision_email_sent: {
                  on: {
                    KYC_HOOK_RESPONDED: [
                      {
                        target: 'kyc_manual_review',
                      },
                    ],
                  },
                  tags: ['revision'],
                },
                get_kyc_session_revision: {
                  on: {
                    SEND_EMAIL: [
                      {
                        target: 'revision_email_sent',
                      },
                    ],
                    API_CALL_ERROR: [
                      {
                        target: 'kyc_auto_reject',
                      },
                    ],
                  },
                  tags: ['revision'],
                },
              },
              initial: 'idle',
              predictableActionArguments: true,
            },
            contextSchema: null,
            documentsSchema: null,
          },
          childWorkflowsRuntimeData: [],
          entity: {
            id: 'clpz8g6zl002a2y1tl6xyqjr1',
            name: 'Alon MAMIU',
            avatarUrl: null,
            approvalState: 'NEW',
          },
          nextEvents: ['UPDATE_CONTEXT', 'reject', 'approve', 'revision'],
          childWorkflows: [],
        },
      ],
    })),
  });

  return handleZodError(error, workflow);
};

export const fetchUpdateWorkflowById = async ({
  workflowId,
  body,
}: IWorkflowId & {
  body: Record<PropertyKey, unknown>;
}) => {
  const [workflow, error] = await apiClient({
    endpoint: `workflows/${workflowId}`,
    method: Method.PATCH,
    body,
    schema: z.any(),
  });

  return handleZodError(error, workflow);
};

export const updateWorkflowDocumentById = async ({
  workflowId,
  documentId,
  body,
  contextUpdateMethod,
}: IWorkflowId & {
  documentId: string;
  body: Record<PropertyKey, unknown>;
  contextUpdateMethod?: 'base' | 'director';
}) => {
  const [workflow, error] = await apiClient({
    endpoint: `workflows/${workflowId}/documents/${documentId}${
      contextUpdateMethod ? `?contextUpdateMethod=${contextUpdateMethod}` : ''
    }`,
    method: Method.PATCH,
    body,
    schema: z.any(),
  });

  return handleZodError(error, workflow);
};

export const updateWorkflowSetAssignById = async ({
  workflowId,
  body,
}: IWorkflowId & {
  body: { assigneeId: string | null; isAssignedToMe?: boolean };
}) => {
  const [workflow, error] = await apiClient({
    endpoint: `workflows/assign/${workflowId}`,
    method: Method.PATCH,
    body,
    schema: z.any(),
  });

  return handleZodError(error, workflow);
};

export const fetchWorkflowEvent = async ({
  workflowId,
  body,
}: IWorkflowId & {
  body:
    | {
        name: string;
      }
    | {
        name: string;
        document: string;
        resubmissionReason: string;
      };
}) => {
  const [workflow, error] = await apiClient({
    endpoint: `workflows/${workflowId}/event`,
    method: Method.POST,
    body,
    schema: z.any(),
  });

  return handleZodError(error, workflow);
};

export const updateWorkflowDecision = async ({
  workflowId,
  documentId,
  body,
  contextUpdateMethod,
}: IWorkflowId & {
  documentId: string;
  body: {
    decision: string | null;
    reason?: string;
    postUpdateEventName?: string;
  };
  contextUpdateMethod: 'base' | 'director';
}) => {
  const [workflow, error] = await apiClient({
    endpoint: `workflows/${workflowId}/decision/${documentId}${
      contextUpdateMethod ? `?contextUpdateMethod=${contextUpdateMethod}` : ''
    }`,
    method: Method.PATCH,
    body,
    schema: WorkflowByIdSchema.pick({
      context: true,
    }),
  });

  return handleZodError(error, workflow);
};

export const fetchWorkflowEventDecision = async ({
  workflowId,
  body,
}: IWorkflowId & {
  body: {
    name: string;
    reason?: string;
  };
}) => {
  const [workflow, error] = await apiClient({
    endpoint: `workflows/${workflowId}/event-decision`,
    method: Method.PATCH,
    body,
    schema: z.any(),
  });

  return handleZodError(error, workflow);
};
