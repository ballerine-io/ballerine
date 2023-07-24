import { intiialKybContext } from '@app/components/organisms/KYBView/kyb-view.schema';
import { KYBStorageService } from '@app/components/organisms/KYBView/services/kyb-storage-service';
import { KYBContext } from '@app/components/organisms/KYBView/types';
import { useCallback, useMemo } from 'react';

export const useFlowContext = (processContext?: (context: KYBContext) => KYBContext) => {
  const snapshotStorage = useMemo(() => new KYBStorageService<KYBContext>(), []);
  const persistedContext = useMemo(
    () =>
      processContext
        ? processContext(snapshotStorage.getData<KYBContext>() || intiialKybContext)
        : snapshotStorage.getData<KYBContext>() || intiialKybContext,
    [snapshotStorage, processContext],
  );

  const save = useCallback(
    (payload: KYBContext) => snapshotStorage.save(payload),
    [snapshotStorage],
  );

  return {
    context: persistedContext,
    storage: snapshotStorage,
    save,
  };
};
