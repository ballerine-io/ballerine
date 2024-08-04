import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { AlertDefinitionsTable } from '@/pages/AlertDefinitions/components/AlertDefinitionsTable';
import { useAlertDefinitionsQuery } from '@/pages/AlertDefinitions/hooks/useAlertDefinitionsQuery';
import { WorkflowsLayout } from '@/pages/Workflows/components/layouts/WorkflowsLayout';

export const AlertDefinitions = () => {
  const { data, isLoading } = useAlertDefinitionsQuery();

  return (
    <DashboardLayout pageName="Alert Definitions">
      <WorkflowsLayout>
        <WorkflowsLayout.Main>
          <AlertDefinitionsTable items={data || []} isFetching={isLoading} />
        </WorkflowsLayout.Main>
      </WorkflowsLayout>
    </DashboardLayout>
  );
};
