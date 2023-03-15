import { useQuery } from '@tanstack/react-query';
import { workflows } from '../../workflows';
import { createWorkflow } from '@ballerine/workflow-browser-sdk';

export const useWorkflowQuery = ({ endUserId }: { endUserId: string }) => {
  return useQuery({
    ...workflows.byId({ endUserId }),
    enabled: !!endUserId,
    select: ({ workflowDefinition, workflowRuntimeData }) => {
      const { definition, definitionType, ...rest } = workflowDefinition;
      const workflow = {
        ...rest,
        workflowDefinitionType: definitionType,
        workflowDefinition: {
          ...definition,
          initial: workflowRuntimeData.currentState?.state ?? definition.initial,
          context: workflowRuntimeData.context,
        },
        workflowContext: {
          machineContext: workflowRuntimeData.context,
          state: workflowRuntimeData.currentState?.state ?? definition.initial,
        },
      };
      const workflowService = createWorkflow(workflow);
      const snapshot = workflowService.getSnapshot();

      return {
        ...workflow,
        nextEvents: snapshot.nextEvents,
      };
    },
  });
};
