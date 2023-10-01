import { request } from '@app/common/utils/request';
import {
  DocumentConfiguration,
  FlowData,
  GetActiveWorkflowDto,
  TCustomer,
  TFlowConfiguration,
  TFlowStep,
  TUser,
  UpdateFlowDto,
} from '@app/domains/collection-flow/types';

export const fetchUser = async (): Promise<TUser> => {
  const result = await request.get('collection-flow/user').json<TUser>();

  return result;
};

export const getFlowSession = fetchUser;

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
  await request.put(`collection-flow`, { json: dto });
};

export const startFlow = async () => {
  await request.post(`collection-flow/finish`);
};

export const resubmitFlow = async () => {
  await request.post(`collection-flow/resubmit`);
};

export const fetchCustomer = async (): Promise<TCustomer> => {
  const result = await request.get('collection-flow/customer').json<TCustomer>();

  return result;
};
