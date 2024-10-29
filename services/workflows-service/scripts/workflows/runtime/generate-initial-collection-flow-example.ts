import { CollectionFlowManager } from '@ballerine/common';
import { createWorkflow } from '@ballerine/workflow-core';
import { Prisma, PrismaClient, UiDefinition } from '@prisma/client';
import { env } from '../../../src/env';

export const getStepsInOrder = async (uiDefinition: UiDefinition) => {
  if (!uiDefinition?.uiSchema) return [];

  const { uiSchema = {}, definition } = uiDefinition as Prisma.JsonObject;
  const { elements } = uiSchema as Prisma.JsonObject;

  if (!elements || !definition) return [];

  const stepsInOrder: string[] = [];

  const stateMachine = createWorkflow({
    runtimeId: '',
    definition: (definition as Prisma.JsonObject).definition as any,
    definitionType: 'statechart-json',
    extensions: {},
    workflowContext: {},
  });

  while (!stateMachine.getSnapshot().done) {
    stepsInOrder.push(stateMachine.getSnapshot().value);
    await stateMachine.sendEvent({ type: 'NEXT' });
  }

  return stepsInOrder.map((stepName, index) => ({ stateName: stepName, orderNumber: index + 1 }));
};

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

  const uiDefinition = await prismaClient.uiDefinition.findFirst({
    where: {
      workflowDefinitionId,
    },
  });

  const collectionFlowManager = new CollectionFlowManager(initialContext, {
    apiUrl: env.APP_API_URL,
    steps: await getStepsInOrder(uiDefinition as UiDefinition),
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
