import { StateTag } from '@ballerine/common';

export const tagToBadgeData = {
  [StateTag.APPROVED]: { variant: 'success', text: 'Approved' },
  [StateTag.REVISION]: { variant: 'warning', text: 'Revisions' },
  [StateTag.REJECTED]: { variant: 'destructive', text: 'Rejected' },
  [StateTag.MANUAL_REVIEW]: { variant: 'info', text: 'Manual Review' },
} as const;
