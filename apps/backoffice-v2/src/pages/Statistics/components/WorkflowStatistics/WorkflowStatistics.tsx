import React, { FunctionComponent } from 'react';
import { useWorkflowStatisticsLogic } from '@/pages/Statistics/components/WorkflowStatistics/hooks/useWorkflowStatisticsLogic/useWorkflowStatisticsLogic';
import { CasesPendingManualReview } from '@/pages/Statistics/components/WorkflowStatistics/components/CasesPendingManualReview/CasesPendingManualReview';
import { ResolvedCasesByMonth } from '@/pages/Statistics/components/WorkflowStatistics/components/ResolvedCasesByMonth/ResolvedCasesByMonth';
import { ActiveCases } from '@/pages/Statistics/components/WorkflowStatistics/components/ActiveCases/ActiveCases';
import { AssignedCasesByUser } from '@/pages/Statistics/components/WorkflowStatistics/components/AssignedCasesByUser/AssignedCasesByUser';

export const WorkflowStatistics: FunctionComponent = () => {
  const {
    resolvedCasesByMonth,
    assignedTags,
    tags,
    tagsWithColor,
    visibleActiveCases,
    visibleActiveCasesAmount,
    assignedCasesPendingManualReview,
    filtersPendingManualReviewWithColor,
    visibleCasesPendingManualReview,
    filtersPendingManualReview,
    visibleCasesPendingManualReviewAmount,
    assignees,
  } = useWorkflowStatisticsLogic();

  return (
    <div>
      <h5 className={'mb-4 font-bold'}>Workflow Statistics</h5>
      <div className={'grid grid-cols-3 gap-6'}>
        <ResolvedCasesByMonth resolvedCasesByMonth={resolvedCasesByMonth} />
        <div className={'grid grid-cols-2 gap-3'}>
          <ActiveCases
            assignedTags={assignedTags}
            tags={tags}
            tagsWithColor={tagsWithColor}
            visibleActiveCases={visibleActiveCases}
            visibleActiveCasesAmount={visibleActiveCasesAmount}
          />
          <CasesPendingManualReview
            assignedCasesPendingManualReview={assignedCasesPendingManualReview}
            filtersPendingManualReviewWithColor={filtersPendingManualReviewWithColor}
            visibleCasesPendingManualReview={visibleCasesPendingManualReview}
            filtersPendingManualReview={filtersPendingManualReview}
            visibleCasesPendingManualReviewAmount={visibleCasesPendingManualReviewAmount}
          />
        </div>
        <AssignedCasesByUser assignees={assignees} />
      </div>
    </div>
  );
};
