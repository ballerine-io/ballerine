import { WorkflowFlowData } from '@app/domains/workflows/flow-data.type';
import { attachStatusesToViews } from './helpers/attach-statuses-to-views';
import { attachWorkflowIssuesToViews } from './helpers/attach-workflow-issues-to-views';
import { findAndActivateFirstViewWithIssue } from './helpers/find-and-activate-first-view-with-issue';
import { useMemo } from 'react';
import { Issue } from '@app/pages/CollectionFlow/components/organisms/KYBView/flows/BaseFlow/hooks/useWorkflowIssues';
import { View } from '@app/common/providers/ViewStateProvider';
import { useCollectionFlowSchemaQuery } from '@app/hooks/useCollectionFlowSchemaQuery';
import { mapCollectionFlowSchemasToViews } from '@app/pages/CollectionFlow/components/organisms/KYBView/flows/BaseFlow/hooks/useBaseFlowViews/helpers/map-collection-flow-schemas-to-views';
import { BaseFlowViewMetadata } from '@app/pages/CollectionFlow/components/organisms/KYBView/flows/BaseFlow/types';

export const useBaseFlowViews = (
  context: WorkflowFlowData,
  issues: Issue[],
): View<BaseFlowViewMetadata>[] => {
  const { schema } = useCollectionFlowSchemaQuery();

  const views = useMemo(() => {
    let processedViews = mapCollectionFlowSchemasToViews(schema);
    processedViews = context ? attachStatusesToViews(processedViews, context) : processedViews;

    processedViews = attachWorkflowIssuesToViews(processedViews, issues);
    processedViews = findAndActivateFirstViewWithIssue(processedViews);

    return processedViews;
  }, [issues, context]);

  return views;
};
