import { useFlowDataQuery } from '@app/components/organisms/KYBView/hooks/useFlowDataQuery';
import { useFlowDataMutation } from '@app/components/organisms/KYBView/hooks/useFlowMutation';
import { WorkflowFlowData } from '@app/domains/workflows/flow-data.type';
import { useCallback, useMemo } from 'react';

interface FlowContextParams {
  processContext?: (context: WorkflowFlowData) => void;
  workflowId?: string;
}

export const useFlowContext = ({ processContext, workflowId }: FlowContextParams) => {
  const { flowData } = useFlowDataQuery(workflowId);
  const { mutate: updateFlowData } = useFlowDataMutation();

  const persistedContext = useMemo(() => {
    return flowData ? (processContext ? processContext(flowData) : flowData) : flowData;
  }, [flowData, processContext]);

  const save = useCallback(
    async (payload: WorkflowFlowData) => {
      await updateFlowData({ payload, workflowId });
    },
    [workflowId, updateFlowData],
  );

  return {
    context: persistedContext,
    flowData,
    save,
  };
};
