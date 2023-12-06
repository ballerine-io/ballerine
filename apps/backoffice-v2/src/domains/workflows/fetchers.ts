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
  childWorkflows: z
    .array(
      BaseWorkflowByIdSchema.omit({
        nextEvents: true,
      }),
    )
    .optional(),
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
        entity: {
          ...data.context?.entity,
          data: {
            ...data.context?.entity?.data,
            additionalInfo: {
              ...data.context?.entity?.data?.additionalInfo,
              associatedCompanies: [
                {
                  country: 'AS',
                  companyName: '1321312',
                  additionalInfo: {
                    customerName: 'Associated customer',
                    kybCompanyName: 'ReDial Limited',
                    customerCompany: 'Associated customer',
                    mainRepresentative: {
                      email: 'danielb+23121@ballerine.com',
                      lastName: 'DOE',
                      firstName: 'JSON',
                    },
                    associationRelationship: 'Minority Shareholder in ReDial Limited',
                  },
                  registrationNumber: 'dwadwadw',
                },
              ],
            },
          },
        },
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
          context: {
            entity: {
              data: {
                country: 'AD',
                companyName: 'e1e2e1',
                businessType: 'Private Limited Company (Ltd)',
                additionalInfo: {
                  companyName: 'ReDial Limited',
                  customerName: 'Associated customer',
                  headquarters: {
                    city: 'dwadwa',
                    phone: '15413214123',
                    street: 'dwadwadwa',
                    country: 'AD',
                    postalCode: '132131',
                    streetNumber: 123,
                  },
                  kybCompanyName: 'ReDial Limited',
                  customerCompany: 'Associated customer',
                  mainRepresentative: {
                    email: 'danielb+2ddw@ballerine.com',
                    lastName: 'e21e12',
                    firstName: '1e21e21',
                  },
                  dateOfEstablishment: '1991-04-11T21:00:00.000Z',
                  associationRelationship: 'Affiliate with ReDial Limited',
                },
                registrationNumber: 'dwadwadwa',
                taxIdentificationNumber: 'dwawdaad',
              },
              type: 'business',
              ballerineEntityId: 'clptm7a62000iy8bsqapoy01a',
            },
            metadata: {
              token: 'b4ab00da-742b-4009-ab6d-6836e0aabfb3',
              customerName: 'Associated customer',
            },
            documents: [
              {
                id: 'certificate-of-incorporation',
                type: 'certificate_of_incorporation',
                pages: [
                  {
                    type: 'image/png',
                    fileName: 'Screenshot from 2023-12-05 13-42-57.png',
                    ballerineFileId: 'clptm8uwn0013y8bskpe1nv3r',
                  },
                ],
                issuer: { country: 'ZZ' },
                version: '1',
                category: 'proof_of_registration',
                decision: {},
                properties: {},
                issuingVersion: 1,
                propertiesSchema: {
                  type: 'object',
                  properties: {
                    issueDate: { type: 'string', format: 'date', formatMaximum: '2023-12-06' },
                    businessName: { type: 'string' },
                    registrationNumber: { type: 'string', pattern: '^[a-zA-Z0-9]*$' },
                  },
                },
              },
              {
                id: 'business-utility-bill',
                type: 'business_utility_bill',
                pages: [
                  {
                    type: 'image/png',
                    fileName: 'Screenshot from 2023-12-05 14-05-57.png',
                    ballerineFileId: 'clptm8xnp0015y8bsek1amlbk',
                  },
                ],
                issuer: { country: 'ZZ' },
                version: '1',
                category: 'proof_of_ownership',
                decision: {},
                properties: {},
                issuingVersion: 1,
                propertiesSchema: {
                  type: 'object',
                  required: ['businessName', 'payerName', 'issueDate'],
                  properties: {
                    issueDate: { type: 'string', format: 'date', formatMaximum: '2023-12-06' },
                    payerName: { type: 'string' },
                    businessName: { type: 'string' },
                  },
                },
              },
            ],
            flowConfig: {
              apiUrl: 'http://localhost:3000',
              tokenId: 'b4ab00da-742b-4009-ab6d-6836e0aabfb3',
              appState: 'finish',
              stepsProgress: {
                company_information: { isCompleted: true },
                business_address_information: { isCompleted: true },
              },
              customerCompany: 'Associated customer',
            },
            customerName: 'Associated customer',
            pluginsOutput: { associated_company_email: {} },
            workflowRuntimeId: 'clptm7a6a000ty8bsautnv44a',
          },
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
