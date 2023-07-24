import { attachStatusesToViews } from '@app/components/organisms/KYBView/flows/BaseFlow/helpers/attachStatusesToViews';
import { KYBStorageService } from '@app/components/organisms/KYBView/services/kyb-storage-service';
import { KYBContext } from '@app/components/organisms/KYBView/types';
import { kybViews } from '@app/components/organisms/KYBView/views';
import { useCallback, useMemo } from 'react';

export const useBaseFlow = () => {
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

  const views = useMemo(() => attachStatusesToViews(kybViews, persistedContext), []);

  return {
    storage: snapshotStorage,
    context: persistedContext,
    views,
    handleViewChange,
    handleViewUpdate,
  };
};
