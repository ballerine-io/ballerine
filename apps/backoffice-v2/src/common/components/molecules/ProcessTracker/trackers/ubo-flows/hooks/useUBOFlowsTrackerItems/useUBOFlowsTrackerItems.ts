import { TWorkflowById } from '@/domains/workflows/fetchers';
import { useMemo } from 'react';
import { valueOrNA } from '@ballerine/common';
import { getEndUserFlowStatus } from './helpers/get-end-user-flow-status';

export const useUBOFlowsTrackerItems = (endUsers: TWorkflowById['endUsers']) => {
  const items = useMemo(
    () =>
      endUsers?.map(endUser => {
        return {
          text: `${valueOrNA(endUser.firstName)} ${valueOrNA(endUser.lastName)}`,
          leftIcon: getEndUserFlowStatus(endUser),
        };
      }) || [],
    [endUsers],
  );

  return items;
};
