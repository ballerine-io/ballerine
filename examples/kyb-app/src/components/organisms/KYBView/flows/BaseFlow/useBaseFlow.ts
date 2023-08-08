import { attachStatusesToViews } from '@app/components/organisms/KYBView/flows/BaseFlow/helpers/attachStatusesToViews';
import { kybViews } from '@app/components/organisms/KYBView/views';
import { serializeBusinessData } from './helpers/serialize-business-data';
import { useCallback, useMemo } from 'react';
import { updateBusiness } from '@app/domains/business';
import { serializeWorkflowRunData } from './helpers/serialize-workflow-run-data';
import { runAndStartWorkflowRequest } from '@app/domains/workflows';
import { WorkflowFlowData } from '@app/domains/workflows/flow-data.type';
import { defaultFlowData } from '@app/domains/workflows/default-flow-data';

export const useBaseFlow = () => {
  const handleFinish = useCallback(async (context: WorkflowFlowData) => {
    const serializedBusinessPayload = serializeBusinessData(context, context.shared.businessId);
    await updateBusiness(serializedBusinessPayload);

    const serializedRunPayload = await serializeWorkflowRunData(context);

    await runAndStartWorkflowRequest(serializedRunPayload);
  }, []);

  const views = useMemo(() => attachStatusesToViews(kybViews, defaultFlowData), []);

  return {
    context: defaultFlowData,
    views,
    handleFinish,
  };
};
