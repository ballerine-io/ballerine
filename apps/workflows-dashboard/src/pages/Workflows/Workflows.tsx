import { Pagination } from '@app/components/molecules/Pagination';
import { StatusFilterComponent } from '@app/pages/Workflows/components/molecules/StatusFilterComponent';
import { useWorkflowsQuery } from '@app/pages/Workflows/hooks/useWorkflowsQuery';
import { useCallback } from 'react';
import { WorkflowsList } from '@app/pages/Workflows/components/organisms/WorkflowsList';
import { WorkflowsLayout } from '@app/pages/Workflows/components/layouts/WorkflowsLayout';
import { DashboardLayout } from '@app/components/layouts/DashboardLayout';
import { useSorting } from '@app/common/hooks/useSorting';
import { WorkflowsMetricLayout } from '@app/pages/Workflows/components/layouts/WorkflowsMetricLayout';
import { ActivePerWorkflow } from '@app/pages/Workflows/components/organisms/metrics/ActivePerWorkflow';
import { WorkflowFiltersProps } from '@app/pages/Workflows/components/providers/WorkflowsFiltersProvider/hocs/withWorkflowFilters/types';
import { withWorkflowFilters } from '@app/pages/Workflows/components/providers/WorkflowsFiltersProvider/hocs/withWorkflowFilters';
import { FilterComponent } from '@app/pages/Workflows/components/organisms/WorkflowFilters/types';
import { WorkflowFilters } from '@app/pages/Workflows/components/organisms/WorkflowFilters';

const filterComponents: FilterComponent[] = [StatusFilterComponent];

interface Props extends WorkflowFiltersProps {}

export const Workflows = withWorkflowFilters(({ filters, updateFilters }: Props) => {
  const { sortingKey, sortingDirection } = useSorting('order_by');
  const { data, isLoading, isFetching } = useWorkflowsQuery(
    filters,
    sortingKey && sortingDirection
      ? { orderBy: sortingKey, orderDirection: sortingDirection }
      : undefined,
  );

  const handlePageChange = useCallback(
    (nextPage: number) => {
      updateFilters({ page: nextPage });
    },
    [updateFilters],
  );

  return (
    <DashboardLayout pageName="Workflows">
      <WorkflowsLayout>
        <WorkflowsLayout.Header>
          <WorkflowsMetricLayout>
            <WorkflowsMetricLayout.Item>
              <ActivePerWorkflow />
            </WorkflowsMetricLayout.Item>
          </WorkflowsMetricLayout>
          <WorkflowFilters
            components={filterComponents}
            values={filters}
            onChange={updateFilters}
          />
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
});
