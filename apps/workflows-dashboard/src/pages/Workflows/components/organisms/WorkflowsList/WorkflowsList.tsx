import { useSorting } from '@app/common/hooks/useSorting';
import { LoadingSpinner } from '@app/components/atoms/LoadingSpinner';
import { WorkflowsTable } from '@app/components/molecules/WorkflowsTable';
import { InputColumn } from '@app/components/molecules/WorkflowsTable/types';
import { IWorkflow } from '@app/domains/workflows/api/workflow';
import { ViewWorkflow } from '@app/pages/Workflows/components/organisms/WorkflowsList/components/ViewWorkflow';

interface Props {
  workflows: IWorkflow[];
  isLoading?: boolean;
  isFetching?: boolean;
}

const columns: InputColumn[] = [
  {
    id: 'view-workflow',
    accessorFn: workflow => workflow,
    cell: info => <ViewWorkflow workflow={info.getValue<IWorkflow>()} />,
  },
];

export const WorkflowsList = ({ workflows, isLoading, isFetching }: Props) => {
  const { sortingKey, sortingDirection, setSorting } = useSorting();

  return isLoading ? (
    <div className="flex w-full justify-center">
      <LoadingSpinner />
    </div>
  ) : (
    <WorkflowsTable
      items={workflows}
      isFetching={isFetching}
      onSort={setSorting}
      sorting={
        sortingKey && sortingDirection
          ? { key: sortingKey, direction: sortingDirection }
          : undefined
      }
      columns={columns}
    />
  );
};
