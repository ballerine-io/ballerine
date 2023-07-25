import { ISnapshotStore } from '@app/common/providers/SnapshotProvider';
import { intiialKybContext } from '@app/components/organisms/KYBView/kyb-view.schema';
import { KYBContext } from '@app/components/organisms/KYBView/types';
import { useCallback, useMemo } from 'react';

export const useFlowContext = (
  storage: ISnapshotStore<KYBContext>,
  processContext?: (context: KYBContext) => KYBContext,
) => {
  const persistedContext = useMemo(() => {
    const storageData = storage.getData<KYBContext>();
    if (storageData && storageData.flowData) {
      return processContext ? processContext(storageData) : storageData;
    }

    return intiialKybContext;
  }, [storage, processContext]);

  const save = useCallback((payload: KYBContext) => storage.save(payload), [storage]);

  return {
    context: persistedContext,
    storage,
    save,
  };
};
