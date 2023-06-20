import { Pagination } from '@app/components/molecules/Pagination';
import { WorkflowsRuntimeLayout } from '@app/pages/WorkflowsRuntime/components/layouts/WorkflowsRuntimeLayout/WorkflowsRuntimeLayout';
import { StatusFilterComponent } from '@app/pages/WorkflowsRuntime/components/molecules/StatusFilterComponent';
import { WorkflowsRuntimeList } from '@app/pages/WorkflowsRuntime/components/molecules/WorkflowsRuntimeList';
import { WorkflowRuntimeFilters } from '@app/pages/WorkflowsRuntime/components/organisms/WorkflowRuntimeFilters';
import { FilterComponent } from '@app/pages/WorkflowsRuntime/components/organisms/WorkflowRuntimeFilters/types';
import { useWorkflowsRuntime } from '@app/pages/WorkflowsRuntime/hooks/useWorkflowsRuntime';
import { useWorkflowsRuntimeFilters } from '@app/pages/WorkflowsRuntime/hooks/useWorkflowsRuntimeFilters';
import { useCallback } from 'react';

const filterComponents: FilterComponent[] = [StatusFilterComponent];

export const WorkflowsRuntime = () => {
  const { filters, setFilters } = useWorkflowsRuntimeFilters();
  const { data, isLoading, isFetching } = useWorkflowsRuntime(filters);

  const handlePageChange = useCallback(
    (nextPage: number) => {
      setFilters({ page: nextPage });
    },
    [setFilters],
  );

  return (
    <WorkflowsRuntimeLayout>
      <WorkflowsRuntimeLayout.Header>
        <WorkflowRuntimeFilters
          components={filterComponents}
          values={filters}
          onChange={setFilters}
        />
      </WorkflowsRuntimeLayout.Header>
      <WorkflowsRuntimeLayout.Main>
        <WorkflowsRuntimeList
          workflowRuntimes={data.results}
          isLoading={isLoading}
          isFetching={isFetching}
        />
      </WorkflowsRuntimeLayout.Main>
      <WorkflowsRuntimeLayout.Footer>
        <Pagination
          totalPages={data.totalPages || 1}
          page={filters.page || 1}
          onChange={handlePageChange}
        />
      </WorkflowsRuntimeLayout.Footer>
    </WorkflowsRuntimeLayout>
  );
};
