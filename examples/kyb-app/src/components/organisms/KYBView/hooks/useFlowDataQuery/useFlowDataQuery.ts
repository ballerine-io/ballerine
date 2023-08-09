import { fetchFlowData } from '@app/domains/workflows';
import { useMemo } from 'react';

export const useFlowDataQuery = (workflowId?: string) => {
  const flowData = useMemo(() => fetchFlowData({ workflowId }), [workflowId]);

  return {
    flowData,
  };
};
