import { LoadingSpinner } from '@app/components/atoms/LoadingSpinner';
import { WorkflowsRuntimeTable } from '@app/components/molecules/WorkflowsRuntimeTable';
import { IWorkflowRuntime } from '@app/domains/workflows-runtime/api/workflows-runtime';

interface Props {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  workflowRuntimes: IWorkflowRuntime[];
  isLoading?: boolean;
  isFetching?: boolean;
  onPageChange: (nextPage: number) => void;
}

export const WorkflowsRuntimeList = ({ workflowRuntimes, isLoading, isFetching }: Props) => {
  return isLoading ? (
    <div className="flex w-full justify-center">
      <LoadingSpinner />
    </div>
  ) : (
    <WorkflowsRuntimeTable items={workflowRuntimes} isFetching={isFetching} />
  );
};
