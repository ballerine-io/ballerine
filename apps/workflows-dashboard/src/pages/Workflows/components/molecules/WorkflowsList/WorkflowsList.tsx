import { LoadingSpinner } from '@app/components/atoms/LoadingSpinner';
import { WorkflowsTable } from '@app/components/molecules/WorkflowsTable';
import { IWorkflow } from '@app/domains/workflows/api/workflow';

interface Props {
  workflows: IWorkflow[];
  isLoading?: boolean;
  isFetching?: boolean;
}

export const WorkflowsList = ({ workflows, isLoading, isFetching }: Props) => {
  return isLoading ? (
    <div className="flex w-full justify-center">
      <LoadingSpinner />
    </div>
  ) : (
    <WorkflowsTable items={workflows} isFetching={isFetching} />
  );
};
