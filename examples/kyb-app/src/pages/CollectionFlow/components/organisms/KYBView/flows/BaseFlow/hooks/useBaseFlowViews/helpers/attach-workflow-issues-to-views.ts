import keyBy from 'lodash/keyBy';
import { View } from '@app/common/providers/ViewStateProvider';
import { Issue } from '@app/pages/CollectionFlow/components/organisms/KYBView/flows/BaseFlow/hooks/useWorkflowIssues';
import { BaseFlowViewMetadata } from '@app/pages/CollectionFlow/components/organisms/KYBView/flows/BaseFlow/types';

export const attachWorkflowIssuesToViews = <T>(views: View<T>[], issues: Issue[]): View<T>[] => {
  const issuesMap = keyBy(issues, 'name');
  const workflowPropertiesViewAlias = {
    companyDocuments: 'documents',
  };

  const viewsWithStatuses = views.map(view => ({
    ...view,
    stepMetadata: {
      status: issuesMap[(workflowPropertiesViewAlias[view.key] as string) || view.key]
        ? 'warning'
        : view.stepMetadata?.status,
    },
  }));

  return viewsWithStatuses;
};
