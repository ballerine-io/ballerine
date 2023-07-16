import { FileStorageProvider } from '@app/common/providers/FileStorageProvider';
import { ViewStateProvider } from '@app/common/providers/ViewStateProvider';
import { Views } from '@app/common/providers/ViewStateProvider/components/ViewResolver/types';
import { FileStorage } from '@app/common/utils/file-storage';
import { kybViewSchema } from '@app/components/organisms/KYBView/kyb-view.schema';
import { DocumentsView } from '@app/components/organisms/KYBView/views/DocumentsView';
import { FinalView } from '@app/components/organisms/KYBView/views/FinalView';
import { MainView } from '@app/components/organisms/KYBView/views/MainView';
import { PersonalInformationView } from '@app/components/organisms/KYBView/views/PersonalInformationView';
import { useMemo } from 'react';

export const KYBView = () => {
  const fileStorage = useMemo(() => new FileStorage(), []);

  const views = useMemo(() => {
    const views: Views<typeof kybViewSchema> = {
      idle: MainView,
      personalInformation: PersonalInformationView,
      documents: DocumentsView,
      errorResolving: () => <div>Not implemented</div>,
      final: FinalView,
    };
    return views;
  }, []);

  return (
    <FileStorageProvider storage={fileStorage}>
      <ViewStateProvider viewSchema={kybViewSchema}>
        <ViewStateProvider.ViewResolver schema={kybViewSchema} paths={views} />
      </ViewStateProvider>
    </FileStorageProvider>
  );
};
