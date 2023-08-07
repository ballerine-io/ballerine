import { View } from '@app/common/providers/ViewStateProvider';
import { BankInformationView } from '@app/components/organisms/KYBView/views/BankInformationView';
import { CompanyActivityView } from '@app/components/organisms/KYBView/views/CompanyActivityView';
import { CompanyDocumentsView } from '@app/components/organisms/KYBView/views/CompanyDocumentsView';
import { CompanyInformationView } from '@app/components/organisms/KYBView/views/CompanyInformationView';
import { HeadquartersView } from '@app/components/organisms/KYBView/views/HeadquartersView';
import { PersonalInformationView } from '@app/components/organisms/KYBView/views/PersonalInformationView';
import { ShareholdersView } from '@app/components/organisms/KYBView/views/ShareholdersView';

export const kybViews: View[] = [
  {
    label: 'Personal Information',
    key: 'personalInformation',
    Component: PersonalInformationView,
  },
  {
    label: 'Company Information',
    key: 'companyInformation',
    Component: CompanyInformationView,
  },
  {
    label: 'Headquarters Address',
    key: 'headquarters',
    Component: HeadquartersView,
  },
  {
    label: 'Company Activity',
    key: 'companyActivity',
    Component: CompanyActivityView,
  },
  {
    label: 'Bank Information',
    key: 'bankInformation',
    Component: BankInformationView,
  },
  {
    label: 'Company Ownership',
    key: 'ubos',
    Component: ShareholdersView,
  },
  {
    label: 'Company Documents',
    key: 'companyDocuments',
    Component: CompanyDocumentsView,
  },
];
