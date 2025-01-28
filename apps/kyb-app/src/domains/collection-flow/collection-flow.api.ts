import { request } from '@/common/utils/request';
import {
  DocumentConfiguration,
  TCustomer,
  TFlowConfiguration,
  TFlowStep,
  TUser,
  UISchema,
} from '@/domains/collection-flow/types';
import {
  CollectionFlowConfig,
  CollectionFlowContext,
} from '@/domains/collection-flow/types/flow-context.types';
import get from 'lodash/get';
import posthog from 'posthog-js';

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

export interface FlowContextResponse {
  context: CollectionFlowContext;
  config: CollectionFlowConfig;
}

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

export interface EndUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export const fetchEndUser = async (): Promise<EndUser> => {
  const result = await request.get('collection-flow/user');

  return result.json<EndUser>();
};

export interface CreateEndUserDto {
  email: string;
  firstName: string;
  lastName: string;
  additionalInfo?: Record<string, unknown>;
}

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
