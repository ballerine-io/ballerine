import { useWorkflowDefinitionQuery } from '@/common/hooks/useWorkflowDefinitionQuery';
import { Card, CardContent, CardHeader } from '@/components/atoms/Card';
import { LoadingSpinner } from '@/components/atoms/LoadingSpinner';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { XstateVisualizer } from '@/components/organisms/XstateVisualizer';
import { IWorkflow } from '@/domains/workflows/api/workflow';
import { WorkflowDefinitionSummaryCard } from '@/pages/WorkflowDefinition/components/WorkflowDefinitionSummaryCard';
import { ViewWorkflow } from '@/pages/Workflows/components/organisms/WorkflowsList/components/ViewWorkflow';
import { isAxiosError } from 'axios';
import { Link, useParams } from 'react-router-dom';

export const WorkflowDefinition = () => {
  const id = useParams<{ id: string }>().id;
  const { data, isLoading, error } = useWorkflowDefinitionQuery(id);

  console.log(error);

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
        <DashboardLayout pageName="Workflow Definition">
          <h1 className="flex flex-col gap-4">Workflow Definition not found.</h1>
          <h2>
            Back to{' '}
            <Link to="/workflow-definitions">
              <span className="underline">list.</span>
            </Link>
          </h2>
        </DashboardLayout>
      );
    }

    return (
      <DashboardLayout pageName="Workflow Definition">
        Failed to fetch workflow definition.
      </DashboardLayout>
    );
  }

  if (!data) return null;

  return (
    <DashboardLayout pageName={`Workflow Definition - ${data?.displayName || data?.name}`}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-row gap-2">
          <div className="w-[75%]">
            <Card className="overflow-hidden">
              <CardHeader className="flex flex-row justify-between">
                <span className="font-bold">X-State Visualizer</span>
                <ViewWorkflow
                  workflow={{ state: '', workflowDefinitionId: data?.id } as IWorkflow}
                />
              </CardHeader>
              <CardContent className="mr-6 flex h-[400px] flex-row overflow-hidden">
                <XstateVisualizer stateDefinition={data?.definition} state={''} />
              </CardContent>
            </Card>
          </div>
          <div className="w-[25%]">
            <WorkflowDefinitionSummaryCard workflowDefinition={data} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
