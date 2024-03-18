import { StateTag } from '@ballerine/common';

export const websiteMonitoringTagsToData = {
  [StateTag.APPROVED]: { variant: 'success', text: 'Approved' },
  [StateTag.REJECTED]: { variant: 'destructive', text: 'Rejected' },
  [StateTag.MANUAL_REVIEW]: { variant: 'info', text: 'Manual Review' },
  [StateTag.PENDING_PROCESS]: { variant: 'warning', text: 'Processing' },
  [StateTag.FAILURE]: { variant: 'destructive', text: 'Failed' },
} as const;
