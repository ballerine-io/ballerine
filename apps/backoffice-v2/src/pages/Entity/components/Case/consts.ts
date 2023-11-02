import { StateTag } from '@ballerine/common';

export const tagToBadgeData = {
  [StateTag.APPROVED]: { variant: 'success', text: 'Approved' },
  [StateTag.REVISION]: { variant: 'warning', text: 'Revisions' },
  [StateTag.REJECTED]: { variant: 'destructive', text: 'Rejected' },
  [StateTag.RESOLVED]: { variant: 'success', text: 'Resolved' },
  [StateTag.MANUAL_REVIEW]: { variant: 'info', text: 'Manual Review' },
  [StateTag.COLLECTION_FLOW]: { variant: 'slate', text: 'Collection in Progress' },
  [StateTag.PENDING_PROCESS]: { variant: 'warning', text: 'Pending ID Verification' },
  [StateTag.FAILURE]: { variant: 'destructive', text: 'Failed' },
  [StateTag.DATA_ENRICHMENT]: { variant: 'primary', text: 'Gathering Data' },
} as const;
