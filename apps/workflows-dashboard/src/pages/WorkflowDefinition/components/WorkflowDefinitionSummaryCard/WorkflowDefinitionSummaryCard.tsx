import { Card, CardContent, CardHeader } from '@/components/atoms/Card';
import { IWorkflowDefinition } from '@/domains/workflow-definitions';
import { valueOrNA } from '@/utils/value-or-na';
import { FunctionComponent } from 'react';

interface IWorkflowDefinitionSummaryCardProps {
  workflowDefinition: IWorkflowDefinition;
}

export const WorkflowDefinitionSummaryCard: FunctionComponent<
  IWorkflowDefinitionSummaryCardProps
> = ({ workflowDefinition }) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <span className="font-bold">Summary</span>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <div className="flex flex-row justify-between">
          <span className="font-bold">ID:</span>
          <span>{workflowDefinition.id}</span>
        </div>
        <div className="flex flex-row justify-between">
          <span className="font-bold">Name:</span>
          <span>{workflowDefinition.name}</span>
        </div>
        <div className="flex flex-row justify-between">
          <span className="font-bold">Display Name:</span>
          <span>{valueOrNA(workflowDefinition.displayName)}</span>
        </div>
        <div className="flex flex-row justify-between">
          <span className="font-bold">Version:</span>
          <span>{valueOrNA(workflowDefinition.version)}</span>
        </div>
        <div className="flex flex-row justify-between">
          <span className="font-bold">Variant:</span>
          <span>{valueOrNA(workflowDefinition.variant)}</span>
        </div>
        <div className="flex flex-row justify-between">
          <span className="font-bold">Created At:</span>
          <span>{new Date(workflowDefinition.createdAt as string).toISOString()}</span>
        </div>
        <div className="flex flex-row justify-between">
          <span className="font-bold">Is Public:</span>
          <span>{workflowDefinition.isPublic ? 'Yes' : 'No'}</span>
        </div>
      </CardContent>
    </Card>
  );
};
