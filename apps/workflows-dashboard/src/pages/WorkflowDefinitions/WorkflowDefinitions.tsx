import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Pagination } from '@/components/molecules/Pagination';
import { withFilters } from '@/components/providers/FiltersProvider/hocs/withFilters';
import { FiltersProps } from '@/components/providers/FiltersProvider/hocs/withFilters/types';
import { WFDefinitionByVariantChart } from '@/pages/WorkflowDefinitions/components/molecules/WFDefinitionByVariantChart';
import { WorkflowDefinitionsTable } from '@/pages/WorkflowDefinitions/components/molecules/WorkflowDefinitionsTable';
import { deserializeQueryParams } from '@/pages/WorkflowDefinitions/helpers/deserialize-query-params';
import { useWorkflowDefinitionsMetrics } from '@/pages/WorkflowDefinitions/hooks/useWorkflowDefinitionsMetrics';
import { useWorkflowDefinitionsPagination } from '@/pages/WorkflowDefinitions/hooks/useWorkflowDefinitionsPagination';
import { useWorkflowDefinitionsQuery } from '@/pages/WorkflowDefinitions/hooks/useWorkflowDefinitionsQuery';
import { WorkflowDefinitionsFilterValues } from '@/pages/WorkflowDefinitions/types/workflow-definitions-filter-values';
import { WorkflowsLayout } from '@/pages/Workflows/components/layouts/WorkflowsLayout';
import { WorkflowsMetricLayout } from '@/pages/Workflows/components/layouts/WorkflowsMetricLayout';
import { BooleanParam, NumberParam, withDefault } from 'use-query-params';

type WorkflowDefinitionsProps = FiltersProps<WorkflowDefinitionsFilterValues>;

export const WorkflowDefinitions = withFilters<
  WorkflowDefinitionsProps,
  WorkflowDefinitionsFilterValues
>(
  ({ filters }: WorkflowDefinitionsProps) => {
    const { data, isLoading } = useWorkflowDefinitionsQuery(filters);
    const { total, page, handlePageChange } = useWorkflowDefinitionsPagination();
    const { metricsByVariant } = useWorkflowDefinitionsMetrics();

    return (
      <DashboardLayout pageName="Workflow Definitions">
        <WorkflowsLayout>
          <WorkflowsLayout.Header>
            <WorkflowsMetricLayout>
              <WorkflowsMetricLayout.Item>
                <WFDefinitionByVariantChart
                  isLoading={metricsByVariant.isLoading}
                  data={metricsByVariant.data}
                />
              </WorkflowsMetricLayout.Item>
            </WorkflowsMetricLayout>
          </WorkflowsLayout.Header>
          <WorkflowsLayout.Main>
            <WorkflowDefinitionsTable items={data?.items || []} isFetching={isLoading} />
          </WorkflowsLayout.Main>
          <WorkflowsLayout.Footer>
            <Pagination totalPages={total} page={page} onChange={handlePageChange} />
          </WorkflowsLayout.Footer>
        </WorkflowsLayout>
      </DashboardLayout>
    );
  },
  {
    deserializer: deserializeQueryParams,
    querySchema: {
      page: withDefault(NumberParam, 1),
      limit: withDefault(NumberParam, 20),
      public: withDefault(BooleanParam, true),
    },
  },
);
