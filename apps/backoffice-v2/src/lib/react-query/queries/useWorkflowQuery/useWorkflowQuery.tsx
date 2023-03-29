import { useQuery } from '@tanstack/react-query';
import { workflows } from '../../workflows';
import { createWorkflow } from '@ballerine/workflow-browser-sdk';
import { isString } from '@/utils/is-string/is-string';

export const useWorkflowQuery = ({ workflowId }: { workflowId: string }) => {
  return useQuery({
    ...workflows.byId({ workflowId }),
    enabled: isString(workflowId) && workflowId.length > 0,
    select: ({ workflowDefinition, workflowRuntimeData }) => {
      const { definition, definitionType, ...rest } = workflowDefinition;
      const workflow = {
        ...rest,
        definitionType,
        definition: {
          ...definition,
          initial: workflowRuntimeData?.state ?? definition.initial,
          context: workflowRuntimeData.context,
        },
        workflowContext: {
          machineContext: workflowRuntimeData.context,
          state: workflowRuntimeData?.state ?? definition.initial,
        },
      };
      const workflowService = createWorkflow(workflow);
      const snapshot = workflowService.getSnapshot();

      return {
        ...workflow,
        runtimeDataId: workflowRuntimeData?.id,
        nextEvents: snapshot.nextEvents,
      };
    },
  });
};
