import { SortingParams } from '@/common/types/sorting-params.types';
import {
  GetWorkflowResponse,
  updateWorkflowState,
  UpdateWorkflowStateDto,
  workflowKeys,
} from '@/domains/workflows/api/workflow';
import { queryClient } from '@/lib/react-query/query-client';
import { WorkflowsFiltersValues } from '@/pages/Workflows/types/workflows-filter-values';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useUpdateWorkflowsStateMutation = () => {
  return useMutation({
    mutationFn: async (dto: UpdateWorkflowStateDto & WorkflowsFiltersValues & SortingParams) =>
      updateWorkflowState(dto),
    onMutate(dto) {
      const { workflowId, state, orderBy, orderDirection, ...query } = dto;
      const sortingParams = orderBy && orderDirection ? { orderBy, orderDirection } : undefined;

      const { queryKey } = workflowKeys.list(query, sortingParams || {});

      queryClient.setQueryData<GetWorkflowResponse>(queryKey, prevData => {
        return {
          ...prevData,
          results: prevData?.results.map(workflow => {
            if (workflow.id === workflowId) {
              return {
                ...workflow,
                state,
              };
            }

            return workflow;
          }),
        } as GetWorkflowResponse;
      });
    },
    onSuccess: () => {
      toast.success('Workflow state updated successfully.');
    },
    onError: () => {
      toast.error('Failed to update workflow state.');
    },
  });
};
