import { useSorting } from '@/common/hooks/useSorting';
import { LoadingSpinner } from '@/components/atoms/LoadingSpinner';
import { WorkflowsTable } from '@/components/molecules/WorkflowsTable';
import { InputColumn } from '@/components/molecules/WorkflowsTable/types';
import { IWorkflow } from '@/domains/workflows/api/workflow';
import { ViewWorkflow } from '@/pages/Workflows/components/organisms/WorkflowsList/components/ViewWorkflow';

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
