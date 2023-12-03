import { request } from '@/common/utils/request';
import {
  DocumentConfiguration,
  TCustomer,
  TFlowConfiguration,
  TFlowStep,
  TUser,
  UISchema,
  UpdateFlowDto,
} from '@/domains/collection-flow/types';
import { CollectionFlowContext } from '@/domains/collection-flow/types/flow-context.types';

export const fetchUser = async (): Promise<TUser> => {
  return await request.get('collection-flow/user').json<TUser>();
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

export const fetchUISchema = async (lng = 'en'): Promise<UISchema> => {
  return await request
    .get(`collection-flow/configuration/${lng}`, {
      searchParams: {
        uiContext: 'collection_flow',
      },
    })
    .json<UISchema>();
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
  return await request.get('collection-flow/customer').json<TCustomer>();
};

export const fetchFlowContext = async (): Promise<CollectionFlowContext> => {
  const result = await request.get('collection-flow/context');

  return (await result.json<{ context: CollectionFlowContext }>()).context || {};
};
