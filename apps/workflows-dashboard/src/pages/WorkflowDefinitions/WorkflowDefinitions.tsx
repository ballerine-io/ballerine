import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Pagination } from '@/components/molecules/Pagination';
import { WFDefinitionByVariantChart } from '@/pages/WorkflowDefinitions/components/molecules/WFDefinitionByVariantChart';
import { WorkflowDefinitionsTable } from '@/pages/WorkflowDefinitions/components/molecules/WorkflowDefinitionsTable';
import { withWorkflowDefinitionFilters } from '@/pages/WorkflowDefinitions/components/providers/WorkflowsFiltersProvider/hocs/withWorkflowDefinitionFilters';
import { WorkflowDefinitionFiltersProps } from '@/pages/WorkflowDefinitions/components/providers/WorkflowsFiltersProvider/hocs/withWorkflowDefinitionFilters/types';
import { useWorkflowDefinitionsPagination } from '@/pages/WorkflowDefinitions/hooks/useWorkflowDefinitionsPagination';
import { useWorkflowDefinitionsQuery } from '@/pages/WorkflowDefinitions/hooks/useWorkflowDefinitionsQuery';
import { WorkflowsLayout } from '@/pages/Workflows/components/layouts/WorkflowsLayout';
import { WorkflowsMetricLayout } from '@/pages/Workflows/components/layouts/WorkflowsMetricLayout';

type WorkflowDefinitionsProps = WorkflowDefinitionFiltersProps;

export const WorkflowDefinitions = withWorkflowDefinitionFilters(
  ({ filters }: WorkflowDefinitionsProps) => {
    const { data, isLoading } = useWorkflowDefinitionsQuery(filters);
    const { total, page, handlePageChange } = useWorkflowDefinitionsPagination();

    return (
      <DashboardLayout pageName="Workflow Definitions">
        <WorkflowsLayout>
          <WorkflowsLayout.Header>
            <WorkflowsMetricLayout>
              <WorkflowsMetricLayout.Item>
                <WFDefinitionByVariantChart data={[]} />
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
);
