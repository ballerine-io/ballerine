import get from 'lodash/get';
import posthog from 'posthog-js';

import { request } from '@/common/utils/request';
import { CollectionFlowContext } from '@/domains/collection-flow/types/flow-context.types';
import {
  CreateEndUserDto,
  DocumentConfiguration,
  EndUser,
  FlowContextResponse,
  IDocumentRecord,
  TCustomer,
  TFlowConfiguration,
  TFlowStep,
  TUser,
  UISchema,
  TUpdateEndUserPluginData,
  TFetchCompanyInformationPluginData,
} from '@/domains/collection-flow/types';

export const fetchUser = async (): Promise<TUser> => {
  const user = await request.get('collection-flow/user').json<TUser>();

  if (user) {
    try {
      posthog.identify(user.id, {
        email: user.email,
      });
    } catch (error) {
      console.error('Error identifying user in PostHog:', error);
    }
  }

  return user;
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

export const fetchUISchema = async (
  language: string,
  endUserId: string | null,
): Promise<UISchema> => {
  return await request
    .get(`collection-flow/${!endUserId ? 'no-user/' : ''}configuration/${language}`, {
      searchParams: {
        uiContext: 'collection_flow',
      },
    })
    .json<UISchema>();
};

export const updateLanguage = async (language: string) => {
  await request.put(`collection-flow/language`, { json: { language } });
};

export const fetchCustomer = async (): Promise<TCustomer> => {
  return await request.get('collection-flow/customer').json<TCustomer>();
};

export const fetchWorkflowId = async (token: string | null): Promise<string> => {
  if (!token) {
    return '';
  }

  return await request.get(`collection-flow/workflow-id`).text();
};

export const fetchFlowContext = async (): Promise<FlowContextResponse> => {
  try {
    const result = await request.get('collection-flow/context');
    const resultJson = await result.json<FlowContextResponse>();

    if (!resultJson || typeof resultJson !== 'object') {
      throw new Error('Invalid flow context');
    }

    return resultJson;
  } catch (error) {
    console.error('Error fetching flow context:', error);
    throw error;
  }
};

export const fetchEndUser = async (): Promise<EndUser> => {
  return await request.get('collection-flow/user').json<EndUser>();
};

export const createEndUserRequest = async ({
  email,
  firstName,
  lastName,
  additionalInfo,
}: CreateEndUserDto) => {
  await request.post('collection-flow/no-user', {
    json: { email, firstName, lastName, additionalInfo },
  });
};

export const syncContext = async (context: CollectionFlowContext) => {
  const result = await request.put('collection-flow/sync', {
    json: {
      data: {
        context,
        endUser: get(context, 'entity.data.additionalInfo.mainRepresentative'),
        business: get(context, 'entity.data'),
        ballerineEntityId: get(context, 'entity.ballerineEntityId'),
      },
    },
  });

  return result.json();
};

export const updateEndUser = async (data: TUpdateEndUserPluginData) => {
  const result = await request.post('collection-flow/end-user', {
    json: data,
  });

  return result.json();
};

export const fetchCompanyInformation = async (data: TFetchCompanyInformationPluginData) => {
  const result = await request.get(`collection-flow/business/business-information`, {
    searchParams: data,
  });

  return result.json();
};

export const finalSubmissionRequest = async (context?: CollectionFlowContext) => {
  const result = await request.post('collection-flow/final-submission', {
    json: {
      eventName: 'COLLECTION_FLOW_FINISHED',
      context,
    },
  });

  return result.json();
};

export const fetchDocumentsByIds = async (ids: string[]) => {
  const result = await request.get('collection-flow/files', {
    searchParams: {
      ids: ids.join(','),
    },
  });

  return result.json<IDocumentRecord[]>();
};
