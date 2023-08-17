import { ViewsData } from '@app/common/providers/ViewStateProvider/hooks/useViewsDataRepository/types';
import { BankInformationContext } from '@app/pages/CollectionFlow/components/organisms/KYBView/views/BankInformationView/types';
import { CompanyActivityConext } from '@app/pages/CollectionFlow/components/organisms/KYBView/views/CompanyActivityView/types';
import { CompanyInformationContext } from '@app/pages/CollectionFlow/components/organisms/KYBView/views/CompanyInformationView/types';
import { HeadquartersContext } from '@app/pages/CollectionFlow/components/organisms/KYBView/views/HeadquartersView/types';

export interface PersonalInformationContext {
  name: {
    firstName: string;
    lastName: string;
  };
  title: string;
  birthDate: string;
  phoneNumber: string;
  companyCheck: boolean;
}

export interface DocumentsContext {
  registrationCertificate: string;
  addressProof: string;
  bankStatement: string;
  companyStructure: string;
}

export interface BusinessAddressContext {
  address: string;
  country: string;
}

export interface UBOSContext {
  check: boolean;
  shareholders: {
    name: {
      firstName: string;
      lastName: string;
    };
    title: string;
    birthDate: string;
    email: string;
  }[];
}

export interface WorkflowFlowData extends ViewsData {
  shared: {
    endUserId?: string;
    businessId?: string;
    workflowId?: string;
  };
  flowData: {
    personalInformation: PersonalInformationContext;
    companyInformation: CompanyInformationContext;
    headquarters: HeadquartersContext;
    companyActivity: CompanyActivityConext;
    bankInformation: BankInformationContext;
    companyDocuments: DocumentsContext;
    ubos: UBOSContext;
  };
}
