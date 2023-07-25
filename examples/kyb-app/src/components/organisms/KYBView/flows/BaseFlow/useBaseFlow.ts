import { attachStatusesToViews } from '@app/components/organisms/KYBView/flows/BaseFlow/helpers/attachStatusesToViews';
import { useFlowContext } from '@app/components/organisms/KYBView/hooks/useFlowContext';
import { KYBContext } from '@app/components/organisms/KYBView/types';
import { kybViews } from '@app/components/organisms/KYBView/views';
import { serializeBusinessData } from './helpers/serialize-business-data';
import { useCallback, useMemo } from 'react';
import { updateBusiness } from '@app/domains/business';
import { serializeWorkflowRunData } from './helpers/serialize-workflow-run-data';
import { runAndStartWorkflowRequest } from '@app/domains/workflows';
import { KYBStorageService } from '@app/components/organisms/KYBView/services/kyb-storage-service';
import { RevisionStorageService } from '@app/components/organisms/KYBView/services/revision-storage-service/revision-storage-service';

export const useBaseFlow = () => {
  const kybStorage = useMemo(() => new KYBStorageService(), []);
  const { storage, context, save } = useFlowContext(kybStorage);

  const handleViewUpdate = useCallback(
    (payload: KYBContext): void => {
      void save(payload);
    },
    [save],
  );

  const handleViewChange = useCallback(
    (viewKey: string) => {
      void save({ ...storage.getData(), currentView: viewKey });
    },
    [storage, save],
  );

  const handleFinish = useCallback(async (context: KYBContext) => {
    const serializedBusinessPayload = serializeBusinessData(context, context.shared.businessId);
    await updateBusiness(serializedBusinessPayload);

    const serializedRunPayload = await serializeWorkflowRunData(context);

    const runResult = await runAndStartWorkflowRequest(serializedRunPayload);

    const revisionStorage = new RevisionStorageService(runResult.workflowRuntimeId);

    revisionStorage.save(context);
  }, []);

  const views = useMemo(() => attachStatusesToViews(kybViews, context), [context]);

  return {
    storage,
    context,
    views,
    handleViewChange,
    handleViewUpdate,
    handleFinish,
  };
};
