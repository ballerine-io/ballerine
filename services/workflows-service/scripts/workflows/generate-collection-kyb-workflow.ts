import { Prisma, PrismaClient } from '@prisma/client';
import { StateTag } from '@ballerine/common';
import { uiKybParentDynamicExample } from './ui-definition/kyb-parent-dynamic-example/ui-kyb-parent-dynamic-example';
import { generateBaseCaseLevelStates } from './generate-base-case-level-states';

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
          COLLECTION_FLOW_FINISHED: [{ target: StateTag.MANUAL_REVIEW }],
        },
      },
      ...generateBaseCaseLevelStates(StateTag.MANUAL_REVIEW, 'COLLECTION_FLOW_FINISHED'),
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
