import { View } from '@app/common/providers/ViewStateProvider';
import { AddressView } from '@app/components/organisms/KYBView/views/AddressView';
import { BusinessView } from '@app/components/organisms/KYBView/views/BusinessView';
import { DocumentsView } from '@app/components/organisms/KYBView/views/DocumentsView';
import { PersonalInformationView } from '@app/components/organisms/KYBView/views/PersonalInformationView';
import { ShareholdersView } from '@app/components/organisms/KYBView/views/ShareholdersView';

export const kybViews: View[] = [
  {
    label: 'Personal Information',
    key: 'personalInformation',
    meta: {
      status: 'warning',
    },
    Component: PersonalInformationView,
  },
  {
    label: 'Business Information',
    key: 'businessInformation',
    Component: BusinessView,
  },
  {
    label: 'Business address',
    key: 'businessAddress',
    Component: AddressView,
  },
  {
    label: 'Business documents',
    key: 'documents',
    Component: DocumentsView,
  },
  {
    label: 'Shareholders/UBOs',
    key: 'ubos',
    Component: ShareholdersView,
  },
];
