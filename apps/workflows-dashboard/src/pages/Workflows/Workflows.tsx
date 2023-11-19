import { Pagination } from '@/components/molecules/Pagination';
import { StatusFilterComponent } from '@/pages/Workflows/components/molecules/StatusFilterComponent';
import { useWorkflowsQuery } from '@/pages/Workflows/hooks/useWorkflowsQuery';
import { useCallback } from 'react';
import { WorkflowsList } from '@/pages/Workflows/components/organisms/WorkflowsList';
import { WorkflowsLayout } from '@/pages/Workflows/components/layouts/WorkflowsLayout';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { useSorting } from '@/common/hooks/useSorting';
import { WorkflowsMetricLayout } from '@/pages/Workflows/components/layouts/WorkflowsMetricLayout';
import { ActivePerWorkflow } from '@/pages/Workflows/components/organisms/metrics/ActivePerWorkflow';
import { WorkflowFiltersProps } from '@/pages/Workflows/components/providers/WorkflowsFiltersProvider/hocs/withWorkflowFilters/types';
import { withWorkflowFilters } from '@/pages/Workflows/components/providers/WorkflowsFiltersProvider/hocs/withWorkflowFilters';
import { FilterComponent } from '@/pages/Workflows/components/organisms/WorkflowFilters/types';
import { WorkflowFilters } from '@/pages/Workflows/components/organisms/WorkflowFilters';
import { AgentCasesStats } from '@/pages/Workflows/components/organisms/metrics/AgentCasesStats';
import { CasesPerStatusStats } from '@/pages/Workflows/components/organisms/metrics/CasesPerStatusStats';
import { AgentsActivityStats } from '@/pages/Workflows/components/organisms/metrics/AgentsActivityStats';

const filterComponents: FilterComponent[] = [StatusFilterComponent];

type Props = WorkflowFiltersProps;

export const Workflows = withWorkflowFilters(({ filters, updateFilters }: Props) => {
  const { sortingKey, sortingDirection } = useSorting('order_by');
  const { fromDate: _, ...workflowsFilters } = filters;

  const { data, isLoading, isFetching } = useWorkflowsQuery(
    workflowsFilters,
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
            <WorkflowsMetricLayout.Item>
              <AgentsActivityStats />
            </WorkflowsMetricLayout.Item>
            <WorkflowsMetricLayout.Item>
              <AgentCasesStats />
            </WorkflowsMetricLayout.Item>
            <WorkflowsMetricLayout.Item>
              <CasesPerStatusStats />
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
