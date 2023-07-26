import { attachStatusesToViews } from '@app/components/organisms/KYBView/flows/BaseFlow/helpers/attachStatusesToViews';
import { useFlowContext } from '@app/components/organisms/KYBView/hooks/useFlowContext';
import { kybViews } from '@app/components/organisms/KYBView/views';
import { serializeBusinessData } from './helpers/serialize-business-data';
import { useCallback, useMemo } from 'react';
import { updateBusiness } from '@app/domains/business';
import { serializeWorkflowRunData } from './helpers/serialize-workflow-run-data';
import { runAndStartWorkflowRequest } from '@app/domains/workflows';
import { KYBStorageService } from '@app/components/organisms/KYBView/services/kyb-storage-service';
import { RevisionStorageService } from '@app/components/organisms/KYBView/services/revision-storage-service/revision-storage-service';
import { WorkflowFlowData } from '@app/domains/workflows/flow-data.type';

export const useBaseFlow = () => {
  const kybStorage = useMemo(() => new KYBStorageService(), []);
  const { context, save } = useFlowContext({});

  const handleViewUpdate = useCallback(
    (payload: WorkflowFlowData): void => {
      void save(payload);
    },
    [save],
  );

  const handleViewChange = useCallback(
    (viewKey: string) => {
      void save({ ...(context as WorkflowFlowData), currentView: viewKey });
    },
    [context, save],
  );

  const handleFinish = useCallback(
    async (context: WorkflowFlowData) => {
      const serializedBusinessPayload = serializeBusinessData(context, context.shared.businessId);
      await updateBusiness(serializedBusinessPayload);

      const serializedRunPayload = await serializeWorkflowRunData(context);

      const runResult = await runAndStartWorkflowRequest(serializedRunPayload);

      const revisionStorage = new RevisionStorageService(runResult.workflowRuntimeId);

      revisionStorage.save(context);
      kybStorage.clear();
    },
    [kybStorage],
  );

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
