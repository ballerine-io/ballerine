import { FlowData } from '@app/domains/collection-flow';
import { WorkflowFlowData } from '@app/domains/workflows/flow-data.type';
import { useCollectionFlowSchemaQuery } from '@app/hooks/useCollectionFlowSchemaQuery';
import { useSessionQuery } from '@app/hooks/useSessionQuery';
import { Issue } from '@app/pages/CollectionFlow/components/organisms/KYBView/flows/BaseFlow/hooks/useWorkflowIssues';
import { AnyObject } from '@ballerine/ui';
import { useMemo } from 'react';

const eraseContextWithIssues = (context: WorkflowFlowData, issues: Issue[]) => {
  issues.forEach(issue => {
    context.flowData[issue.name] = context[issue.name] as AnyObject;
  });

  return context;
};

export const useFlowContext = (flow: FlowData, issues: Issue[]): WorkflowFlowData => {
  const { user } = useSessionQuery();
  const { steps } = useCollectionFlowSchemaQuery();

  const workflowContext = useMemo(() => {
    if (!flow || !steps.length) return null;

    const initialFlowData = steps.reduce((flowData, step) => {
      flowData[step.key] = step.defaultData;

      return flowData;
    }, {});

    const context: WorkflowFlowData = {
      currentView: flow && !flow.flowState ? steps[0].key : flow.flowState,
      shared: {
        workflowId: flow?.id,
        endUserId: user?.id,
      },
      flowData: {
        ...initialFlowData,
        ...flow?.flowData,
      },
      completionMap: {},
    };

    if (!flow) return context;

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];

      if (step.key !== context.currentView) {
        context.completionMap[step.key] = true;
        continue;
      }

      break;
    }

    context.shared.workflowId = flow.id;
    context.shared.endUserId = user.id;

    eraseContextWithIssues(context, issues);

    return context;
  }, [flow, user, issues]);

  return workflowContext;
};
