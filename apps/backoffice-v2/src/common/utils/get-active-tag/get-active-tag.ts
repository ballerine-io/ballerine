import { StateTag, TStateTag } from '@ballerine/common';

// Priority order: most critical states first
const TAG_PRIORITY: TStateTag[] = [
  StateTag.REJECTED,
  StateTag.FLAGGED,
  StateTag.FAILURE,
  StateTag.REVISION,
  StateTag.MANUAL_REVIEW,
  StateTag.PENDING_PROCESS,
  StateTag.COLLECTION_FLOW,
  StateTag.DATA_ENRICHMENT,
  StateTag.APPROVED,
  StateTag.DISMISSED,
  StateTag.RESOLVED,
  StateTag.EDIT,
];

export const getActiveTag = (tags: readonly TStateTag[] | undefined): TStateTag | undefined => {
  if (!tags?.length) {
    return undefined;
  }

  for (const priority of TAG_PRIORITY) {
    if (tags.includes(priority)) {
      return priority;
    }
  }

  return tags[0];
};
