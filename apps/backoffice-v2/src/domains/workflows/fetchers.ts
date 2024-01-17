import qs from 'qs';
import { deepCamelKeys } from 'string-ts';
import { z } from 'zod';
import { apiClient } from '../../common/api-client/api-client';
import { Method, States } from '../../common/enums';
import { handleZodError } from '../../common/utils/handle-zod-error/handle-zod-error';
import { ObjectWithIdSchema } from '../../lib/zod/utils/object-with-id/object-with-id';
import { zPropertyKey } from '../../lib/zod/utils/z-property-key/z-property-key';
import { IWorkflowId } from './interfaces';
import { WorkflowDefinitionVariant } from '@ballerine/common';

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
    version: z.number(),
    variant: z.string().default(WorkflowDefinitionVariant.DEFAULT),
    contextSchema: z.record(z.any(), z.any()).nullable(),
    documentsSchema: z.array(z.any()).optional().nullable(),
    config: z.record(z.any(), z.any()).nullable(),
    definition: z.object({
      states: z.record(z.string(), z.object({ tags: z.array(z.string()) })),
    }),
  }),
  createdAt: z.string().datetime(),
  context: z.object({
    documents: z.array(z.any()).default([]),
    entity: z.record(z.any(), z.any()),
    parentMachine: ObjectWithIdSchema.extend({
      status: z.union([z.literal('active'), z.literal('failed'), z.literal('completed')]),
    }).optional(),
    pluginsOutput: z.record(zPropertyKey, z.any()).optional(),
    metadata: z
      .object({
        collectionFlowUrl: z.string().url().optional(),
        token: z.string().optional(),
      })
      .passthrough()
      .optional(),
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
      workflowDefinition: {
        ...data.workflowDefinition,
        config: {
          ...data.workflowDefinition.config,
          isCaseOverviewEnabled: true,
        },
        extensions: {
          apiPlugins: [
            {
              name: 'collection_invite_email',
              status: 'IDLE',
              pluginKind: 'email',
              url: `{secret.EMAIL_API_URL}`,
              successAction: 'INVIATION_SENT',
              errorAction: 'INVIATION_FAILURE',
              method: 'POST',
              stateNames: ['collection_invite'],
              headers: {
                Authorization: 'Bearer {secret.EMAIL_API_TOKEN}',
                'Content-Type': 'application/json',
              },
              request: {
                transform: [
                  {
                    transformer: 'jmespath',
                    mapping: `{
                customerName: metadata.customerName,
                collectionFlowUrl: join('',['{secret.COLLECTION_FLOW_URL}','/?token=',metadata.token,'&lng=',workflowRuntimeConfig.language]),
                from: 'no-reply@ballerine.com',
                receivers: [entity.data.additionalInfo.mainRepresentative.email],
                language: workflowRuntimeConfig.language,
                templateId: 'd-8949519316074e03909042cfc5eb4f02',
                adapter: '{secret.MAIL_ADAPTER}'
              }`, // jmespath
                  },
                ],
              },
              response: {
                transform: [],
              },
            },
            {
              name: 'kyb',
              status: 'IN_PROGRESS',
              pluginKind: 'api',
              url: `{secret.UNIFIED_API_URL}/companies-v2/{entity.data.country}/{entity.data.registrationNumber}`,
              method: 'GET',
              stateNames: ['run_vendor_data'],
              successAction: 'VENDOR_DONE',
              errorAction: 'VENDOR_FAILED',
              persistResponseDestination: 'pluginsOutput.businessInformation',
              headers: { Authorization: 'Bearer {secret.UNIFIED_API_TOKEN}' },
              request: {
                transform: [
                  {
                    transformer: 'jmespath',
                    mapping: `merge(
                { vendor: 'asia-verify' },
                entity.data.country == 'HK' && {
                  callbackUrl: join('',['{secret.APP_API_URL}/api/v1/external/workflows/',workflowRuntimeId,'/hook/VENDOR_DONE','?resultDestination=pluginsOutput.businessInformation.data&processName=kyb-unified-api'])
                }
              )`, // jmespath
                  },
                ],
              },
              response: {
                transform: [
                  {
                    transformer: 'jmespath',
                    mapping: '@', // jmespath
                  },
                ],
              },
            },
            {
              name: 'company_sanctions',
              status: 'SUCCESS',
              pluginKind: 'api',
              url: `{secret.UNIFIED_API_URL}/companies/{entity.data.country}/{entity.data.companyName}/sanctions`,
              method: 'GET',
              stateNames: ['run_vendor_data'],
              successAction: 'VENDOR_DONE',
              errorAction: 'VENDOR_FAILED',
              persistResponseDestination: 'pluginsOutput.companySanctions',
              headers: { Authorization: 'Bearer {secret.UNIFIED_API_TOKEN}' },
              request: {
                transform: [
                  {
                    transformer: 'jmespath',
                    mapping: `{
                vendor: 'asia-verify'
              }`, // jmespath
                  },
                ],
              },
              response: {
                transform: [
                  {
                    transformer: 'jmespath',
                    mapping: '@', // jmespath
                  },
                ],
              },
            },
            {
              name: 'ubo',
              status: 'ERROR',
              pluginKind: 'api',
              url: `{secret.UNIFIED_API_URL}/companies/{entity.data.country}/{entity.data.registrationNumber}/ubo`,
              method: 'GET',
              stateNames: ['run_vendor_data'],
              successAction: 'VENDOR_DONE',
              errorAction: 'VENDOR_FAILED',
              persistResponseDestination: 'pluginsOutput.ubo.request',
              headers: { Authorization: 'Bearer {secret.UNIFIED_API_TOKEN}' },
              request: {
                transform: [
                  {
                    transformer: 'jmespath',
                    mapping: `{
                vendor: 'asia-verify',
                callbackUrl: join('',['{secret.APP_API_URL}/api/v1/external/workflows/',workflowRuntimeId,'/hook/VENDOR_DONE','?resultDestination=pluginsOutput.ubo.data&processName=ubo-unified-api'])
              }`, // jmespath
                  },
                ],
              },
              response: {
                transform: [
                  {
                    transformer: 'jmespath',
                    mapping: '{request: @}', // jmespath
                  },
                ],
              },
            },
            {
              name: 'resubmission_email',
              status: 'IDLE',
              pluginKind: 'email',
              url: `{secret.EMAIL_API_URL}`,
              method: 'POST',
              successAction: 'EMAIL_SENT',
              errorAction: 'EMAIL_FAILURE',
              stateNames: ['pending_resubmission'],
              headers: {
                Authorization: 'Bearer {secret.EMAIL_API_TOKEN}',
                'Content-Type': 'application/json',
              },
              request: {
                transform: [
                  {
                    transformer: 'jmespath',
                    // #TODO: create new token (new using old one)
                    mapping: `{
                kybCompanyName: entity.data.companyName,
                customerCompanyName: metadata.customerName,
                firstName: entity.data.additionalInfo.mainRepresentative.firstName,
                resubmissionLink: join('',['{secret.COLLECTION_FLOW_URL}','/?token=',metadata.token,'&lng=',workflowRuntimeConfig.language]),
                supportEmail: join('',['support@',metadata.customerName,'.com']),
                from: 'no-reply@ballerine.com',
                name: join(' ',[metadata.customerName,'Team']),
                receivers: [entity.data.additionalInfo.mainRepresentative.email],
                templateId: 'd-7305991b3e5840f9a14feec767ea7301',
                revisionReason: documents[].decision[].revisionReason | [0],
                language: workflowRuntimeConfig.language,
                adapter: ''
              }`, // jmespath
                  },
                ],
              },
              response: {
                transform: [],
              },
            },
          ],
          childWorkflowPlugins: [
            {
              pluginKind: 'child',
              name: 'veriff_kyc_child_plugin',
              definitionId: 'kycEmailSessionDefinition.id',
              transformers: [
                {
                  transformer: 'jmespath',
                  mapping: `{entity: {data: @, type: 'individual'}}`,
                },
              ],
              initEvent: 'start',
            },
          ],
          commonPlugins: [
            {
              pluginKind: 'iterative',
              name: 'ubos_iterative',
              actionPluginName: 'veriff_kyc_child_plugin',
              stateNames: ['run_ubos'],
              iterateOn: [{ transformer: 'jmespath', mapping: 'entity.data.additionalInfo.ubos' }],
              successAction: 'EMAIL_SENT_TO_UBOS',
              errorAction: 'FAILED_EMAIL_SENT_TO_UBOS',
            },
          ],
        },
      },
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
