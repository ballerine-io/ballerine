import { SnapshotProvider } from '@app/common/providers/SnapshotProvider';
import { ViewStateProvider } from '@app/common/providers/ViewStateProvider';
import { convertViewsToPaths } from '@app/common/providers/ViewStateProvider/utils/convertViewsToPaths';
import { AppShell } from '@app/components/layouts/AppShell';
import { BackButton } from '@app/components/organisms/KYBView/components/BackButton';
import { SnapshotSynchronizer } from '@app/components/organisms/KYBView/components/SnapshotSynchronizer';
import { serializeSnapshotData } from '@app/components/organisms/KYBView/helpers/serializeSnapshotData';
import { KYBStorageService } from '@app/components/organisms/KYBView/services/kyb-storage-service';
import { KYBContext } from '@app/components/organisms/KYBView/types';
import { kybViews } from '@app/components/organisms/KYBView/views';
import { useCallback, useMemo } from 'react';

export const KYBView = () => {
  const snapshotStorage = useMemo(() => new KYBStorageService(), []);

  const beforeSnapshotSave = useCallback((context: KYBContext) => {
    return serializeSnapshotData(context);
  }, []);

  const views = useMemo(() => {
    const views = convertViewsToPaths(kybViews);
    return views;
  }, []);

  return (
    <SnapshotProvider storage={snapshotStorage} onBeforeSave={beforeSnapshotSave}>
      <ViewStateProvider views={kybViews}>
        <AppShell backButton={<BackButton />}>
          <SnapshotSynchronizer />
          <ViewStateProvider.ViewResolver paths={views} />
        </AppShell>
      </ViewStateProvider>
    </SnapshotProvider>
  );
};
