import { CollectionFlowManager } from '@ballerine/common';
import { PrismaClient } from '@prisma/client';
import { env } from '../../../src/env';

export const generateInitialCollectionFlowExample = async (
  prismaClient: PrismaClient,
  {
    workflowDefinitionId,
    projectId,
    endUserId,
    businessId,
    token,
  }: {
    workflowDefinitionId: string;
    projectId: string;
    endUserId: string;
    businessId: string;
    token: string;
  },
) => {
  const initialContext = {
    ballerineEntityId: businessId,
    type: 'business',
    data: {
      additionalInfo: {
        mainRepresentative: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'test@gmail.com',
        },
      },
    },
    documents: [],
    metadata: {
      token,
      collectionFlowUrl: env.COLLECTION_FLOW_URL,
      webUiSDKUrl: env.WEB_UI_SDK_URL,
    },
  };

  const collectionFlowManager = new CollectionFlowManager(initialContext, {
    apiUrl: env.APP_API_URL,
    steps: [],
  });

  collectionFlowManager.start();

  const creationArgs = {
    data: {
      endUserId: endUserId,
      workflowDefinitionId: workflowDefinitionId,
      projectId: projectId,
      state: 'collection_flow',
      context: collectionFlowManager.context,
      businessId: businessId,
      workflowDefinitionVersion: 1,
    },
  };
  const workflowRuntime = await prismaClient.workflowRuntimeData.create(creationArgs);

  const workflowToken = await prismaClient.workflowRuntimeDataToken.create({
    data: {
      endUserId: endUserId,
      token: token,
      workflowRuntimeDataId: workflowRuntime.id,
      projectId: projectId,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  return workflowToken;
};
