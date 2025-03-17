import { ProcessStatus, UnifiedApiReason } from '@ballerine/common';

export const getPluginStatus = (response: Record<string, unknown>) => {
  if (response.reason === UnifiedApiReason.NOT_IMPLEMENTED) {
    return ProcessStatus.CANCELED;
  }

  if (response.error) {
    return ProcessStatus.ERROR;
  }

  return ProcessStatus.IN_PROGRESS;
};
