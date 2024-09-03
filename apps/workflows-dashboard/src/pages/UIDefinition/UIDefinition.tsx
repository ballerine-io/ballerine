import { LoadingSpinner } from '@/components/atoms/LoadingSpinner';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { useUIDefinitionQuery } from '@/pages/UIDefinition/hooks/useUIDefinitionQuery';
import { UIDefinitionEditor } from '@/pages/WorkflowDefinition/components/UIDefinitionEditor';
import { isAxiosError } from 'axios';
import { Link, useParams } from 'react-router-dom';

export const UIDefinition = () => {
  const id = useParams<{ id: string }>().id;
  const { data, isLoading, error } = useUIDefinitionQuery({ uiDefinitionId: id! });

  if (isLoading) {
    return (
      <DashboardLayout pageName="Loading">
        <div className="flex h-full w-full justify-center">
          <LoadingSpinner />
        </div>
      </DashboardLayout>
    );
  }

  if (isAxiosError(error)) {
    if (error.response?.status === 404) {
      return (
        <DashboardLayout pageName="UI Definition">
          <h1 className="flex flex-col gap-4">UI Definition not found.</h1>
          <h2>
            Back to{' '}
            <Link to="/ui-definitions">
              <span className="underline">list.</span>
            </Link>
          </h2>
        </DashboardLayout>
      );
    }

    return (
      <DashboardLayout pageName="UI Definition">Failed to fetch ui definition.</DashboardLayout>
    );
  }

  if (!data) return null;

  return (
    <DashboardLayout pageName={`UI Definition - ${data?.id}`}>
      <UIDefinitionEditor uiDefinition={data} />
    </DashboardLayout>
  );
};
