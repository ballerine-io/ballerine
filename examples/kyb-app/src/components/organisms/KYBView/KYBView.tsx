import { ViewStateProvider } from '@app/common/providers/ViewStateProvider';
import { Views } from '@app/common/providers/ViewStateProvider/components/ViewResolver/types';
import { kybViewSchema } from '@app/components/organisms/KYBView/kyb-view.schema';
import { DocumentsView } from '@app/components/organisms/KYBView/views/DocumentsView';
import { MainView } from '@app/components/organisms/KYBView/views/MainView';
import { PersonalInformationView } from '@app/components/organisms/KYBView/views/PersonalInformationView';
import { useMemo } from 'react';

export const KYBView = () => {
  const views = useMemo(() => {
    const views: Views<typeof kybViewSchema> = {
      idle: MainView,
      personalInformation: PersonalInformationView,
      documents: DocumentsView,
      errorResolving: () => <div>error resolving</div>,
    };
    return views;
  }, []);

  return (
    <ViewStateProvider viewSchema={kybViewSchema}>
      <ViewStateProvider.ViewResolver schema={kybViewSchema} paths={views} />
    </ViewStateProvider>
  );
};
