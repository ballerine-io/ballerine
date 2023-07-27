import { AnyChildren } from '@ballerine/ui';
import { snapshotContext } from './snapshot.context';
import {
  AfterSaveHook,
  BeforeSaveHook,
  SnapshotContext,
} from '@app/common/providers/SnapshotProvider/types';
import { useCallback, useMemo } from 'react';
import { ISnapshotStore } from '@app/common/providers/SnapshotProvider/snapshot-store.abstract';

const { Provider } = snapshotContext;

interface Props {
  children: AnyChildren;
  storage: ISnapshotStore;
  onBeforeSave?: BeforeSaveHook;
  onAfterSave?: AfterSaveHook;
}

export const SnapshotProvider = ({ children, storage, onBeforeSave, onAfterSave }: Props) => {
  const save = useCallback(
    (data: object) => {
      const savePayload = onBeforeSave ? onBeforeSave(data) : data;

      storage.save(savePayload);
      onAfterSave && onAfterSave(savePayload);
    },
    [storage, onBeforeSave, onAfterSave],
  );

  const clear = useCallback(() => {
    storage.clear();
  }, [storage]);

  const context = useMemo(() => {
    const ctx: SnapshotContext = {
      save,
      clear,
      getData: () => storage.getData(),
    };

    return ctx;
  }, [storage, save, clear]);

  return <Provider value={context}>{children}</Provider>;
};
