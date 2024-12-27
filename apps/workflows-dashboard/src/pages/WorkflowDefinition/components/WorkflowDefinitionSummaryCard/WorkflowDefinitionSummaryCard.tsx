import { Card, CardContent, CardHeader } from '@/components/atoms/Card';
import { IWorkflowDefinition } from '@/domains/workflow-definitions';
import { valueOrNA } from '@/utils/value-or-na';
import { FunctionComponent } from 'react';
import dayjs from 'dayjs';

interface IWorkflowDefinitionSummaryCardProps {
  workflowDefinition: IWorkflowDefinition;
}

export const WorkflowDefinitionSummaryCard: FunctionComponent<
  IWorkflowDefinitionSummaryCardProps
> = ({ workflowDefinition }) => {
  return (
    <Card className="h-full bg-gradient-to-br from-slate-50 to-white shadow-lg">
      <CardHeader className="border-b border-slate-200 bg-white/50 ">
        <h2 className="text-lg font-bold text-slate-800">Workflow Summary</h2>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 p-6">
        {[
          { label: 'ID', value: workflowDefinition.id },
          { label: 'Name', value: workflowDefinition.name },
          { label: 'Display Name', value: valueOrNA(workflowDefinition.displayName) },
          { label: 'Version', value: valueOrNA(workflowDefinition.version) },
          { label: 'Variant', value: valueOrNA(workflowDefinition.variant) },
          {
            label: 'Created At',
            value: dayjs(workflowDefinition.createdAt).format('MMM D, YYYY h:mm A'),
          },
          {
            label: 'Is Public',
            value: workflowDefinition.isPublic ? (
              <span className="rounded-full bg-red-100 px-2 py-1 text-sm font-medium text-red-800">
                Yes
              </span>
            ) : (
              <span className="rounded-full bg-green-100 px-2 py-1 text-sm font-medium text-green-800">
                No
              </span>
            ),
          },
        ].map(({ label, value }, index) => (
          <div
            key={label}
            className="flex flex-row items-center justify-between rounded-lg bg-white/40 p-3 shadow-sm transition-all hover:bg-white/60"
          >
            <span className="text-sm font-medium text-slate-600">{label}</span>
            <span className="text-sm text-slate-800">{value}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
