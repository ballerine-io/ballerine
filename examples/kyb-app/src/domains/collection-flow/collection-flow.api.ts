import { request } from '@app/common/utils/request';
import {
  AuthorizeDto,
  DocumentConfiguration,
  FlowData,
  GetActiveWorkflowDto,
  GetSessionDto,
  TFlowConfiguration,
  TFlowStep,
  TUser,
  UISchema,
  UpdateFlowDto,
} from '@app/domains/collection-flow/types';

export const authorizeUser = async (dto: AuthorizeDto): Promise<TUser> => {
  const result = await request
    .post('collection-flow/authorize', {
      json: {
        email: dto.email,
        flowType: import.meta.env.VITE_KYB_DEFINITION_ID,
      },
    })
    .json<TUser>();

  return {
    id: result.id,
    email: result.email,
    businessId: result.businesses.at(-1).id,
  } as TUser;
};

export const getFlowSession = async (query: GetSessionDto) => {
  // Uisng same endpoint as used for auth till session mechanism will be implemented in backend for collection flow
  return authorizeUser(query);
};

export const fetchCollectionFlowSchema = async (): Promise<{
  steps: TFlowStep[];
  documentConfigurations: DocumentConfiguration[];
}> => {
  const result = await request
    .get(`collection-flow/configuration`, {
      searchParams: {
        flowType: import.meta.env.VITE_KYB_DEFINITION_ID as string,
      },
    })
    .json<TFlowConfiguration>();

  return {
    steps: result.steps,
    documentConfigurations: result.documentConfigurations,
  };
};

export const fetchUISchema = async (): Promise<UISchema> => {
  const result = await request
    .get('internal/ui-definition/workflow-runtime/test-workflow-risk-id-1', {
      searchParams: {
        uiContext: 'collection_flow',
      },
    })
    .json<UISchema>();

  return result;
};

export const fetchActiveWorkflow = async (dto: GetActiveWorkflowDto): Promise<FlowData> => {
  const result = await request
    .get('collection-flow/active-flow', {
      searchParams: {
        endUserId: dto.endUserId,
        flowType: import.meta.env.VITE_KYB_DEFINITION_ID as string,
      },
    })
    .json<{ result: FlowData }>();

  return result.result;
};

export const updateFlow = async (dto: UpdateFlowDto) => {
  const { flowId, ...payload } = dto;
  await request.put(`collection-flow/${flowId}`, { json: payload });
};

export const startFlow = async (flowId: string) => {
  await request.post(`collection-flow/finish/${flowId}`);
};

export const resubmitFlow = async (flowId: string) => {
  await request.post(`collection-flow/resubmit/${flowId}`);
};
