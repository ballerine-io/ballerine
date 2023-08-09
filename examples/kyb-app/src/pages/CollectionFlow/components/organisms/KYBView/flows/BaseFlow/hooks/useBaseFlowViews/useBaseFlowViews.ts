import { WorkflowFlowData } from '@app/domains/workflows/flow-data.type';
import { attachStatusesToViews } from './helpers/attach-statuses-to-views';
import { attachWorkflowIssuesToViews } from './helpers/attach-workflow-issues-to-views';
import { findAndActivateFirstViewWithIssue } from './helpers/find-and-activate-first-view-with-issue';
import { kybViews } from './views';
import { useMemo } from 'react';
import { Issue } from '@app/pages/CollectionFlow/components/organisms/KYBView/flows/BaseFlow/hooks/useWorkflowIssues';
import { View } from '@app/common/providers/ViewStateProvider';

export const useBaseFlowViews = (context: WorkflowFlowData, issues: Issue[]): View[] => {
  const views = useMemo(() => {
    let processedViews = kybViews;
    processedViews = context ? attachStatusesToViews(processedViews, context) : kybViews;

    processedViews = attachWorkflowIssuesToViews(processedViews, issues);
    processedViews = findAndActivateFirstViewWithIssue(processedViews);

    return processedViews;
  }, [issues, context]);

  return views;
};
