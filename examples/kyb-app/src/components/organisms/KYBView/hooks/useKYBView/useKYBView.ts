import { View } from '@app/common/providers/ViewStateProvider';
import { useQueryValues } from '@app/components/organisms/KYBView/hooks/useQueryParams';
import { KYBStorageService } from '@app/components/organisms/KYBView/services/kyb-storage-service';
import { KYBContext, KYBQueryParams } from '@app/components/organisms/KYBView/types';
import { useCallback, useMemo } from 'react';

export const useKYBView = (views: View[]) => {
  const { workflowRuntimeId } = useQueryValues<KYBQueryParams>();
  const snapshotStorage = useMemo(() => new KYBStorageService<KYBContext>(), []);
  const persistedContext = useMemo(() => snapshotStorage.getData<KYBContext>(), [snapshotStorage]);

  const handleViewUpdate = useCallback(
    (payload: KYBContext): void => {
      void snapshotStorage.save(payload);
    },
    [snapshotStorage],
  );

  const handleViewChange = useCallback(
    (viewKey: string) => {
      void snapshotStorage.save({ ...snapshotStorage.getData(), currentView: viewKey });
    },
    [snapshotStorage],
  );

  return {
    storage: snapshotStorage,
    context: persistedContext,
    handleViewChange,
    handleViewUpdate,
  };
};
