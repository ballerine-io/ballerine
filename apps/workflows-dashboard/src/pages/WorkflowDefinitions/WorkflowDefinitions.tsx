import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { WFDefinitionByVariantChart } from '@/pages/WorkflowDefinitions/components/molecules/WFDefinitionByVariantChart';
import { WorkflowsLayout } from '@/pages/Workflows/components/layouts/WorkflowsLayout';
import { WorkflowsMetricLayout } from '@/pages/Workflows/components/layouts/WorkflowsMetricLayout';

export const WorkflowDefinitions = () => {
  return (
    <DashboardLayout pageName="Workflow Definitions">
      <WorkflowsLayout>
        <WorkflowsLayout.Header>Workflow Definitions</WorkflowsLayout.Header>
        <WorkflowsLayout.Main>
          <WorkflowsMetricLayout>
            <WorkflowsMetricLayout.Item>
              <WFDefinitionByVariantChart data={[]} />
            </WorkflowsMetricLayout.Item>
          </WorkflowsMetricLayout>
        </WorkflowsLayout.Main>
      </WorkflowsLayout>
    </DashboardLayout>
  );
};
