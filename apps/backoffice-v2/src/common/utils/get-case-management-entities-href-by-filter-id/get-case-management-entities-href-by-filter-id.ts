import { StateTag } from '@ballerine/common';

const ACTION_REQUIRED_FILTER_PREFIXES = [
  'filter-sl-kyc-individuals-',
  'filter-sl-kyb-businesses-',
  'filter-sl-loan-applications-',
] as const;

const shouldUseManualReviewAsDefaultCaseStatus = (filterId: string) =>
  ACTION_REQUIRED_FILTER_PREFIXES.some(prefix => filterId.startsWith(prefix));

export const getCaseManagementEntitiesHrefByFilterId = ({
  locale,
  filterId,
}: {
  locale: string;
  filterId: string;
}) => {
  const searchParams = new URLSearchParams({
    filterId,
  });

  if (shouldUseManualReviewAsDefaultCaseStatus(filterId)) {
    searchParams.set('filter[caseStatus][0]', StateTag.MANUAL_REVIEW);
  }

  return `/${locale}/case-management/entities?${searchParams.toString()}`;
};
