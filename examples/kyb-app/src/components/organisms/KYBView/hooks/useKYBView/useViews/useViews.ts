import { kybViews } from '@app/components/organisms/KYBView/views';
import { useWorkflowQuery } from '@app/components/organisms/KYBView/views/RevisionView/hooks/useWorkflowQuery';

export const useViews = (workflowId?: string) => {
  const { isLoading, error } = useWorkflowQuery(workflowId);

  return {
    views: kybViews,
    isLoading,
    error,
  };
};
