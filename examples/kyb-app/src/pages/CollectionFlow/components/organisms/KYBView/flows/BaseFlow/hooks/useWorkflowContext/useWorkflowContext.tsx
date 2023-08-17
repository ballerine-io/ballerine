import { defaultFlowData } from '@app/domains/workflows/default-flow-data';
import { WorkflowFlowData } from '@app/domains/workflows/flow-data.type';
import { Workflow } from '@app/domains/workflows/types';
import { Issue } from '@app/pages/CollectionFlow/components/organisms/KYBView/flows/BaseFlow/hooks/useWorkflowIssues';
import { AnyObject } from '@ballerine/ui';
import { useMemo } from 'react';

const eraseContextWithIssues = (context: WorkflowFlowData, issues: Issue[]) => {
  issues.forEach(issue => {
    context.flowData[issue.name] = context[issue.name] as AnyObject;
  });

  return context;
};

export const useWorkflowContext = (workflow: Workflow, issues: Issue[]): WorkflowFlowData => {
  const workflowContext = useMemo(() => {
    if (!workflow) return defaultFlowData;

    const context = JSON.parse(
      workflow.context.entity.data.additionalInfo.__kyb_snapshot,
    ) as WorkflowFlowData;

    context.shared.workflowId = workflow.id;

    eraseContextWithIssues(context, issues);

    return context;
  }, [workflow, issues]);

  return workflowContext;
};
