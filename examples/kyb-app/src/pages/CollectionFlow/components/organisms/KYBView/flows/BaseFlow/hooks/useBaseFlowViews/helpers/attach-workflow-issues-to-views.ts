import keyBy from 'lodash/keyBy';
import { View } from '@app/common/providers/ViewStateProvider';
import { Issue } from '@app/pages/CollectionFlow/components/organisms/KYBView/flows/BaseFlow/hooks/useWorkflowIssues';

export const attachWorkflowIssuesToViews = (views: View[], issues: Issue[]): View[] => {
  const issuesMap = keyBy(issues, 'name');
  const workflowPropertiesViewAlias = {
    companyDocuments: 'documents',
  };

  const viewsWithStatuses = views.map(view => ({
    ...view,
    meta: {
      status: issuesMap[(workflowPropertiesViewAlias[view.key] as string) || view.key]
        ? 'warning'
        : view.meta?.status,
    },
  }));

  return viewsWithStatuses as View[];
};
