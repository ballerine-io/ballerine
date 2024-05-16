import { StateTag } from '@ballerine/common';

export const tagToBadgeData = {
  [StateTag.APPROVED]: { variant: 'success', text: 'Approved' },
  [StateTag.REVISION]: { variant: 'warning', text: 'Revisions' },
  [StateTag.REJECTED]: { variant: 'destructive', text: 'Rejected' },
  [StateTag.RESOLVED]: { variant: 'success', text: 'Resolved' },
  [StateTag.MANUAL_REVIEW]: { variant: 'info', text: 'Manual Review' },
  [StateTag.COLLECTION_FLOW]: { variant: 'violet', text: 'Collection in Progress' },
  [StateTag.PENDING_PROCESS]: { variant: 'warning', text: 'Pending ID Verification' },
  [StateTag.FAILURE]: { variant: 'destructive', text: 'Failed' },
  [StateTag.DATA_ENRICHMENT]: { variant: 'violet', text: 'Awaiting 3rd Party Data' },
  [StateTag.DISMISSED]: { variant: 'success', text: 'Dismissed' },
  [StateTag.FLAGGED]: { variant: 'destructive', text: 'Flagged' },
} as const;
