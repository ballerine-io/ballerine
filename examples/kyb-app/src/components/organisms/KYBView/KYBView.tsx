import { SnapshotProvider } from '@app/common/providers/SnapshotProvider';
import { ViewStateProvider } from '@app/common/providers/ViewStateProvider';
import { Views } from '@app/common/providers/ViewStateProvider/components/ViewResolver/types';
import { AppShell } from '@app/components/layouts/AppShell';
import { BackButton } from '@app/components/organisms/KYBView/components/BackButton';
import { SnapshotSynchronizer } from '@app/components/organisms/KYBView/components/SnapshotSynchronizer';
import { serializeSnapshotData } from '@app/components/organisms/KYBView/helpers/serializeSnapshotData';
import { kybViewSchema } from '@app/components/organisms/KYBView/kyb-view.schema';
import { KYBStorageService } from '@app/components/organisms/KYBView/services/kyb-storage-service';
import { KYBContext } from '@app/components/organisms/KYBView/types';
import { DocumentsView } from '@app/components/organisms/KYBView/views/DocumentsView';
import { FinalView } from '@app/components/organisms/KYBView/views/FinalView';
import { MainView } from '@app/components/organisms/KYBView/views/MainView';
import { PersonalInformationView } from '@app/components/organisms/KYBView/views/PersonalInformationView';
import { RevisionView } from '@app/components/organisms/KYBView/views/RevisionView';
import { useCallback, useMemo } from 'react';

export const KYBView = () => {
  const snapshotStorage = useMemo(() => new KYBStorageService(), []);

  const beforeSnapshotSave = useCallback((context: KYBContext) => {
    return serializeSnapshotData(context);
  }, []);

  const views = useMemo(() => {
    const views: Views<typeof kybViewSchema> = {
      idle: MainView,
      personalInformation: PersonalInformationView,
      documents: DocumentsView,
      revision: RevisionView,
      final: FinalView,
    };
    return views;
  }, []);

  return (
    <SnapshotProvider storage={snapshotStorage} onBeforeSave={beforeSnapshotSave}>
      <ViewStateProvider viewSchema={kybViewSchema} initialContext={snapshotStorage.getData()}>
        <AppShell backButton={<BackButton />}>
          <SnapshotSynchronizer />
          <ViewStateProvider.ViewResolver schema={kybViewSchema} paths={views} />
        </AppShell>
      </ViewStateProvider>
    </SnapshotProvider>
  );
};
