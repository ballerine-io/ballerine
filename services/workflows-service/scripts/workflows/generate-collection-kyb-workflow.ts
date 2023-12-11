import { Prisma, PrismaClient } from '@prisma/client';
import { StateTag } from '@ballerine/common';
import { uiKybParentDynamicExample } from './ui-definition/ui-kyb-parent-dynamic-example';

export const kybParentDynamicExample = {
  id: 'dynamic_kyb_parent_example',
  name: 'dynamic_kyb_parent_example',
  version: 1,
  definitionType: 'statechart-json',
  definition: {
    id: 'kyb_parent_example_v1',
    predictableActionArguments: true,
    initial: 'idle',
    context: {
      documents: [],
    },
    states: {
      idle: {
        on: {
          COLLECTION_FLOW_FINISHED: 'manual_review',
        },
      },
      manual_review: {
        tags: [StateTag.MANUAL_REVIEW],
        on: {
          revision: 'revision',
        },
      },
      revision: {
        tags: [StateTag.REVISION],
        on: {
          COLLECTION_FLOW_FINISHED: 'manual_review',
        },
      },
      reject: {
        tags: [StateTag.REVISION],
        type: 'final' as const,
      },
    },
  },
  extensions: {
    apiPlugins: [],
    childWorkflowPlugins: [],
    commonPlugins: [],
  },
  config: {
    workflowLevelResolution: true,
    childCallbackResults: [],
  },
} as const satisfies Prisma.WorkflowDefinitionUncheckedCreateInput;
export const generateCollectionKybWorkflow = async (
  prismaClient: PrismaClient,
  projectId: string,
) => {
  const kybDynamicExample = {
    ...kybParentDynamicExample,
    isPublic: !projectId,
    projectId: projectId,
  };

  const workflow = await prismaClient.workflowDefinition.create({
    data: kybDynamicExample,
  });

  await uiKybParentDynamicExample(prismaClient, workflow.id, projectId);

  return workflow;
};
