import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { UIDefinitionsTable } from '@/pages/UIDefinitions/components/UIDefinitionsTable';
import { useUIDefinitionsQuery } from '@/pages/UIDefinitions/hooks/useUIDefinitionsQuery';
import { WorkflowsLayout } from '@/pages/Workflows/components/layouts/WorkflowsLayout';

export const UIDefinitions = () => {
  const { data, isLoading } = useUIDefinitionsQuery();

  return (
    <DashboardLayout pageName="UI Definitions">
      <WorkflowsLayout>
        <WorkflowsLayout.Main>
          <UIDefinitionsTable items={data || []} isFetching={isLoading} />
        </WorkflowsLayout.Main>
      </WorkflowsLayout>
    </DashboardLayout>
  );
};
