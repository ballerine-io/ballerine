import { useQuery } from '@tanstack/react-query';
import { workflows } from '../../workflows';
import { createWorkflow } from '@ballerine/workflow-browser-sdk';
import { isString } from '../../../../utils/is-string/is-string';
import { useIsAuthenticated } from '../../../../context/AuthProvider/hooks/useIsAuthenticated/useIsAuthenticated';

export const useWorkflowQuery = ({ workflowId }: { workflowId: string }) => {
  const isAuthenticated = useIsAuthenticated();

  return useQuery({
    ...workflows.byId({ workflowId }),
    enabled: isString(workflowId) && workflowId.length > 0 && isAuthenticated,
    select: ({ workflowDefinition, workflowRuntimeData }) => {
      const { definition, definitionType, ...rest } = workflowDefinition;
      const workflow = {
        ...rest,
        definitionType,
        definition: {
          ...definition,
          initial: workflowRuntimeData?.state ?? definition?.initial,
          context: workflowRuntimeData?.context,
        },
        workflowContext: {
          machineContext: {
            ...workflowRuntimeData?.context,
            documents: workflowRuntimeData?.context?.documents?.map(document => ({
              ...document,
              id: `${document?.category}-${document?.type}-${document?.issuer?.country}`.toLowerCase(),
            })),
          },
          state: workflowRuntimeData?.state ?? definition?.initial,
        },
      };
      const workflowService = createWorkflow(workflow);
      const snapshot = workflowService.getSnapshot();

      return {
        ...workflow,
        runtimeDataId: workflowRuntimeData?.id,
        assigneeId: workflowRuntimeData?.assigneeId,
        nextEvents: snapshot.nextEvents,
      };
    },
  });
};
