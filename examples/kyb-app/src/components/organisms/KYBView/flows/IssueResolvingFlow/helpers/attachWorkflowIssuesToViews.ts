import keyBy from 'lodash/keyBy';
import { View } from '@app/common/providers/ViewStateProvider';
import { Issue } from '@app/components/organisms/KYBView/flows/IssueResolvingFlow/helpers/extractIssuesFromWorkflow';

export const attachWorkflowIssuesToViews = (views: View[], issues: Issue[]): View[] => {
  const issuesMap = keyBy(issues, 'name');

  const viewsWithStatuses = views.map(view => ({
    ...view,
    meta: {
      status: issuesMap[view.key] ? 'warning' : view.meta?.status,
    },
  }));

  return viewsWithStatuses as View[];
};
