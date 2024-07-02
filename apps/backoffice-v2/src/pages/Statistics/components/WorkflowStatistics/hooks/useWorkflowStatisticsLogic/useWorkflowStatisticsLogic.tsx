import { useMemo } from 'react';
import { HSL_PIE_COLORS } from '@/pages/Statistics/constants';

export const useWorkflowStatisticsLogic = () => {
  const tags = [
    {
      id: 'ckl1y5e0x0000wxrmsgft7bf0',
      name: 'Pending manual review',
      value: 15,
    },
    {
      id: 'ckl1y5e0x0002wxrmnd8j9rb7',
      name: 'Collection Flow',
      value: 5,
    },
    {
      id: 'ckl1y5e0x0002wxrmnd8j9rb7',
      name: 'Revisions',
      value: 3,
    },
    {
      id: 'ckl1y5e0x0002wxrmnd8j9rb7',
      name: 'Awaiting 3rd party data',
      value: 2,
    },
  ];
  const tagsWithColor = useMemo(
    () =>
      tags
        ?.slice()
        ?.sort((a, b) => b.value - a.value)
        ?.map((filter, index) => ({
          ...filter,
          color: HSL_PIE_COLORS[index] ?? HSL_PIE_COLORS[0],
        })),
    [tags],
  );
  const assignedTags = useMemo(
    () => tagsWithColor?.reduce((acc, filter) => acc + filter.value, 0),
    [tagsWithColor],
  );
  const visibleActiveCasesAmount = 4;
  const visibleActiveCases = useMemo(
    () => tagsWithColor?.slice(0, visibleActiveCasesAmount),
    [tagsWithColor],
  );

  const filtersPendingManualReview = [
    {
      id: 'ckl1y5e0x0000wxrmsgft7bf0',
      name: 'Merchant Onboarding',
      value: 15,
    },
  ];
  const filtersPendingManualReviewWithColor = useMemo(
    () =>
      filtersPendingManualReview
        ?.slice()
        ?.sort((a, b) => b.value - a.value)
        ?.map((filter, index) => ({
          ...filter,
          color: HSL_PIE_COLORS[index] ?? HSL_PIE_COLORS[0],
        })),
    [filtersPendingManualReview],
  );
  const assignedCasesPendingManualReview = useMemo(
    () => filtersPendingManualReviewWithColor?.reduce((acc, filter) => acc + filter.value, 0),
    [filtersPendingManualReviewWithColor],
  );
  const visibleCasesPendingManualReviewAmount = 4;
  const visibleCasesPendingManualReview = useMemo(
    () => filtersPendingManualReviewWithColor?.slice(0, visibleActiveCasesAmount),
    [filtersPendingManualReviewWithColor],
  );
  const assignees = [
    {
      name: 'John Doe',
      value: 3,
    },
    {
      name: 'Jane Doe',
      value: 8,
    },
    {
      name: 'Bob Smith',
      value: 0,
    },
  ];
  const resolvedCasesByMonth = [
    { month: 'Jan 22', category1: 650 },
    { month: 'Feb 22', category1: 1300 },
    { month: 'Mar 22', category1: 2600 },
    { month: 'Apr 22', category1: 300 },
    { month: 'May 22', category1: 1300 },
    { month: 'Jun 22', category1: 1950 },
    { month: 'Jul 22', category1: 100 },
  ];

  return {
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
  };
};
