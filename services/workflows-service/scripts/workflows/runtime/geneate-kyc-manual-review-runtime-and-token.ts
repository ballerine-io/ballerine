import { PrismaClient } from '@prisma/client';
import { env } from '../../../src/env';

export const generateKycManualReviewRuntimeAndToken = async (
  prismaClient: PrismaClient,
  {
    workflowDefinitionId,
    projectId,
    endUserId,
    token,
  }: {
    workflowDefinitionId: string;
    projectId: string;
    endUserId: string;
    token: string;
  },
) => {
  const creationArgs = {
    data: {
      endUserId,
      projectId,
      workflowDefinitionId,
      state: 'manual_review',
      context: {
        workflowId: workflowDefinitionId,
        entity: {
          ballerineEntityId: endUserId,
          type: 'individuals',
          data: {
            firstName: 'John',
            lastName: 'Doe',
            email: 'test@gmail.com',
          },
        },
        documents: [],
        metadata: {
          collectionFlowUrl: env.COLLECTION_FLOW_URL,
          webUiSDKUrl: env.WEB_UI_SDK_URL,
          token,
        },
      },
      businessId: null,
      workflowDefinitionVersion: 1,
    },
  };

  const workflowRuntime = await prismaClient.workflowRuntimeData.create(creationArgs);

  return prismaClient.workflowRuntimeDataToken.create({
    data: {
      token,
      projectId,
      endUserId,
      workflowRuntimeDataId: workflowRuntime.id,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });
};
