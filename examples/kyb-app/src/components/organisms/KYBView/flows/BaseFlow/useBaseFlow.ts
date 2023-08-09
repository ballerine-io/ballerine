import { attachStatusesToViews } from '@app/components/organisms/KYBView/flows/BaseFlow/helpers/attachStatusesToViews';
import { useFlowContext } from '@app/components/organisms/KYBView/hooks/useFlowContext';
import { kybViews } from '@app/components/organisms/KYBView/views';
import { serializeBusinessData } from './helpers/serialize-business-data';
import { useCallback, useMemo } from 'react';
import { updateBusiness } from '@app/domains/business';
import { serializeWorkflowRunData } from './helpers/serialize-workflow-run-data';
import { runAndStartWorkflowRequest, updateFlowData } from '@app/domains/workflows';
import { WorkflowFlowData } from '@app/domains/workflows/flow-data.type';

export const useBaseFlow = () => {
  const { context, save } = useFlowContext({});

  const handleViewUpdate = useCallback(
    (payload: WorkflowFlowData): void => {
      void save(payload);
    },
    [save],
  );

  const handleViewChange = useCallback(
    (context: WorkflowFlowData, viewKey: string) => {
      void save({ ...context, currentView: viewKey });
    },
    [save],
  );

  const handleFinish = useCallback(async (context: WorkflowFlowData) => {
    const serializedBusinessPayload = serializeBusinessData(context, context.shared.businessId);
    await updateBusiness(serializedBusinessPayload);

    const serializedRunPayload = await serializeWorkflowRunData(context);

    const { workflowRuntimeId } = await runAndStartWorkflowRequest(serializedRunPayload);

    void updateFlowData({ workflowId: workflowRuntimeId, payload: context });
  }, []);

  const views = useMemo(
    () => (context ? attachStatusesToViews(kybViews, context) : kybViews),
    [context],
  );

  return {
    context,
    views,
    handleViewChange,
    handleViewUpdate,
    handleFinish,
  };
};
