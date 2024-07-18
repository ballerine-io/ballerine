import {
  GetWorkflowDefinitionsListDto,
  workflowDefinitionsQueryKeys,
} from '@/domains/workflow-definitions';
import { useQuery } from '@tanstack/react-query';

export const useWorkflowDefinitionsQuery = (
  query: GetWorkflowDefinitionsListDto = { page: 1, limit: 20 },
) => {
  const { data, isLoading } = useQuery({
    ...workflowDefinitionsQueryKeys.list(query),
    //@ts-ignore
    enabled: true,
    keepPreviousData: true,
  });

  return {
    data,
    isLoading,
  };
};
