import { attachStatusesToViews } from '@app/components/organisms/KYBView/flows/BaseFlow/helpers/attachStatusesToViews';
import { attachWorkflowIssuesToViews } from '@app/components/organisms/KYBView/flows/IssueResolvingFlow/helpers/attachWorkflowIssuesToViews';
import { extractIssuesFromWorkflow } from '@app/components/organisms/KYBView/flows/IssueResolvingFlow/helpers/extractIssuesFromWorkflow';
import { enableActiveOnFirstViewWithIssue } from '@app/components/organisms/KYBView/flows/IssueResolvingFlow/helpers/toggleActiveOnFirstViewWithIssue';
import { useFlowContext } from '@app/components/organisms/KYBView/hooks/useFlowContext';
import { useQueryValues } from '@app/components/organisms/KYBView/hooks/useQueryParams';
import { KYBQueryParams } from '@app/components/organisms/KYBView/types';
import { kybViews } from '@app/components/organisms/KYBView/views';
import { useWorkflowQuery } from '@app/components/organisms/KYBView/hooks/useWorkflowQuery';
import { WorkflowFlowData } from '@app/domains/workflows/flow-data.type';
import { AnyObject } from '@ballerine/ui';
import { useCallback, useMemo } from 'react';
import { updateWorkflow } from '@app/domains/workflows';
import { serializeWorkflowUpdatePayload } from '@app/domains/workflows/serialize/run-and-start-workflow.serialize';
import { serializeWorkflowRunData } from '@app/components/organisms/KYBView/flows/BaseFlow/helpers/serialize-workflow-run-data';

export const useIssueResolvingFlow = () => {
  const { workflowRuntimeId } = useQueryValues<KYBQueryParams>();
  const { isLoading, error, workflow } = useWorkflowQuery(workflowRuntimeId);
  const viewsIssues = useMemo(() => {
    if (!workflow) return [];

    return extractIssuesFromWorkflow(workflow);
  }, [workflow]);

  const eraseContextWithIssues = (context: WorkflowFlowData) => {
    viewsIssues.forEach(issue => {
      context.flowData[issue.name] = context[issue.name] as AnyObject;
    });

    return context;
  };

  const { context, save } = useFlowContext({
    processContext: eraseContextWithIssues,
    workflowId: workflowRuntimeId,
  });

  const processedViews = useMemo(() => {
    let views = kybViews;
    views = context ? attachStatusesToViews(views, context) : views;
    views = attachWorkflowIssuesToViews(views, viewsIssues);
    views = enableActiveOnFirstViewWithIssue(views);

    return views;
  }, [viewsIssues, context]);

  const handleViewUpdate = useCallback(
    (payload: WorkflowFlowData): void => {
      void save(payload);
    },
    [save],
  );

  const handleViewChange = useCallback(
    (context: WorkflowFlowData, viewKey: string) => {
      void save({ ...context, currentView: viewKey });
    },
    [context, save],
  );

  const warnings = useMemo(
    () =>
      viewsIssues.reduce((warnings, issue) => {
        Object.keys(issue.properties).forEach(propertyName => {
          warnings[propertyName] = issue.properties[propertyName].reason;
        });

        return warnings;
      }, {}),
    [viewsIssues],
  );

  const handleFinish = useCallback(
    async (context: WorkflowFlowData) => {
      const serializedUpdatePayload = await serializeWorkflowRunData(context);

      await updateWorkflow({ workflowId: workflowRuntimeId, payload: serializedUpdatePayload });
    },
    [workflowRuntimeId],
  );

  return {
    views: processedViews,
    isLoading: isLoading,
    loadError: error,
    context,
    warnings,
    handleViewUpdate,
    handleViewChange,
    handleFinish,
  };
};
