import { Pagination } from '@app/components/molecules/Pagination';
import { StatusFilterComponent } from '@app/pages/Workflows/components/molecules/StatusFilterComponent';
import { FilterComponent } from '@app/pages/Workflows/components/organisms/WorkflowFilters/types';
import { useWorkflows } from '@app/pages/Workflows/hooks/useWorkflows';
import { useWorkflowsFilters } from '@app/pages/Workflows/hooks/useWorkflowsFilters';
import { useCallback } from 'react';
import { WorkflowsList } from '@app/pages/Workflows/components/molecules/WorkflowsList';
import { WorkflowFilters } from '@app/pages/Workflows/components/organisms/WorkflowFilters';
import { WorkflowsLayout } from '@app/pages/Workflows/components/layouts/WorkflowsLayout';
import { DashboardLayout } from '@app/components/layouts/DashboardLayout';
import { WorkflowMetrics } from '@app/pages/Workflows/components/organisms/WorkflowMetrics';

const filterComponents: FilterComponent[] = [StatusFilterComponent];

export const Workflows = () => {
  const { filters, setFilters } = useWorkflowsFilters();
  const { data, isLoading, isFetching } = useWorkflows(filters);

  const handlePageChange = useCallback(
    (nextPage: number) => {
      setFilters({ page: nextPage });
    },
    [setFilters],
  );

  return (
    <DashboardLayout pageName="Workflows">
      <WorkflowsLayout>
        <WorkflowsLayout.Header>
          <WorkflowMetrics />
          <WorkflowFilters components={filterComponents} values={filters} onChange={setFilters} />
        </WorkflowsLayout.Header>
        <WorkflowsLayout.Main>
          <WorkflowsList workflows={data.results} isLoading={isLoading} isFetching={isFetching} />
        </WorkflowsLayout.Main>
        <WorkflowsLayout.Footer>
          <Pagination
            totalPages={data.meta.pages || 1}
            page={filters.page || 1}
            onChange={handlePageChange}
          />
        </WorkflowsLayout.Footer>
      </WorkflowsLayout>
    </DashboardLayout>
  );
};
