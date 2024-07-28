import { SortingParams } from '@/common/types/sorting-params.types';
import {
  GetWorkflowResponse,
  IWorkflow,
  sendWorkflowEvent,
  SendWorkflowEventDto,
  workflowKeys,
} from '@/domains/workflows/api/workflow';
import { queryClient } from '@/lib/react-query/query-client';
import { WorkflowsFiltersValues } from '@/pages/Workflows/types/workflows-filter-values';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useSendWorkflowEventMutation = () => {
  return useMutation({
    //@ts-ignore
    mutationFn: async (dto: SendWorkflowEventDto & WorkflowsFiltersValues & SortingParams) =>
      sendWorkflowEvent({ workflowId: dto.workflowId, name: dto.name }),
    onSuccess: () => {
      toast.success('Workflow definition updated successfully.');
    },
    onError: () => {
      toast.error('Failed to update workflow definition.');
    },
    onSettled: (data: IWorkflow, error, dto, context) => {
      const { workflowId, name, orderBy, orderDirection, ...query } = dto;
      const sortingParams = orderBy && orderDirection ? { orderBy, orderDirection } : undefined;

      const { queryKey } = workflowKeys.list(query, sortingParams || {});

      queryClient.setQueryData<GetWorkflowResponse>(queryKey, prevData => {
        return {
          ...prevData,
          results: prevData?.results.map(workflow => {
            if (workflow.id === workflowId) {
              return {
                ...workflow,
                state: data.state,
                tags: data.tags,
                status: data.status,
              };
            }

            return workflow;
          }),
        } as GetWorkflowResponse;
      });
    },
  });
};
