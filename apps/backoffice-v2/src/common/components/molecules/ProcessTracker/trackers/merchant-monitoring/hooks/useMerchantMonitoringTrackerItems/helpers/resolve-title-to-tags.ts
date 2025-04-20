import { StateTag } from '@ballerine/common';

export const resolveTitleToTags = (tags: string[]) => {
  if (tags?.includes(StateTag.PENDING_PROCESS)) {
    return 'Risk Analysis';
  }

  if (tags?.includes(StateTag.FAILURE)) {
    return 'Process failed.';
  }

  if (tags?.includes(StateTag.MANUAL_REVIEW)) {
    return 'Manual Review';
  }

  if (tags?.includes(StateTag.REJECTED)) {
    return 'Rejected';
  }

  if (tags?.includes(StateTag.APPROVED)) {
    return 'Approved';
  }
};
