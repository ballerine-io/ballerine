import { useQuery } from '@tanstack/react-query';
import { createWorkflow } from '@ballerine/workflow-browser-sdk';
import { isString } from '../../../../../common/utils/is-string/is-string';
import { workflowsQueryKeys } from '../../../query-keys';
import { useIsAuthenticated } from '../../../../auth/context/AuthProvider/hooks/useIsAuthenticated/useIsAuthenticated';

export const useWorkflowQuery = ({ workflowId }: { workflowId: string }) => {
  const isAuthenticated = useIsAuthenticated();

  return useQuery({
    ...workflowsQueryKeys.byId({ workflowId }),
    enabled: isString(workflowId) && !!workflowId.length && isAuthenticated,
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
