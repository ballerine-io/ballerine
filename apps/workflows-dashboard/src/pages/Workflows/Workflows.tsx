import { useSorting } from '@/common/hooks/useSorting';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Pagination } from '@/components/molecules/Pagination';
import { withFilters } from '@/components/providers/FiltersProvider/hocs/withFilters';
import { FiltersProps } from '@/components/providers/FiltersProvider/hocs/withFilters/types';
import { IWorkflowStatus } from '@/domains/workflows/api/workflow';
import { WorkflowsLayout } from '@/pages/Workflows/components/layouts/WorkflowsLayout';
import { WorkflowsMetricLayout } from '@/pages/Workflows/components/layouts/WorkflowsMetricLayout';
import { StatusFilterComponent } from '@/pages/Workflows/components/molecules/StatusFilterComponent';
import { WorkflowFilters } from '@/pages/Workflows/components/organisms/WorkflowFilters';
import { FilterComponent } from '@/pages/Workflows/components/organisms/WorkflowFilters/types';
import { WorkflowsList } from '@/pages/Workflows/components/organisms/WorkflowsList';
import { ActivePerWorkflow } from '@/pages/Workflows/components/organisms/metrics/ActivePerWorkflow';
import { AgentCasesStats } from '@/pages/Workflows/components/organisms/metrics/AgentCasesStats';
import { AgentsActivityStats } from '@/pages/Workflows/components/organisms/metrics/AgentsActivityStats';
import { CasesPerStatusStats } from '@/pages/Workflows/components/organisms/metrics/CasesPerStatusStats';
import { deserializeQueryParams } from '@/pages/Workflows/helpers/deserialize-query-params';
import { useWorkflowsQuery } from '@/pages/Workflows/hooks/useWorkflowsQuery';
import { WorkflowsFiltersValues } from '@/pages/Workflows/types/workflows-filter-values';
import { useCallback } from 'react';
import { ArrayParam, NumberParam, StringParam, withDefault } from 'use-query-params';

const filterComponents: FilterComponent[] = [StatusFilterComponent];

export const Workflows = withFilters<FiltersProps<WorkflowsFiltersValues>, WorkflowsFiltersValues>(
  ({ filters, updateFilters }) => {
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
  },
  {
    querySchema: {
      page: withDefault(NumberParam, 1),
      limit: withDefault(NumberParam, 25),
      orderBy: withDefault(StringParam, 'createdAt'),
      orderDirection: withDefault(StringParam, 'desc'),
      status: withDefault(ArrayParam, [] as IWorkflowStatus[]),
      fromDate: withDefault(NumberParam, Date.now()),
    },
    deserializer: deserializeQueryParams,
  },
);
