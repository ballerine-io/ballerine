import { ViewsData } from '@app/common/providers/ViewStateProvider/hooks/useViewsDataRepository/types';
import { BankInformationContext } from '@app/components/organisms/KYBView/views/BankInformationView/types';
import { CompanyActivityConext } from '@app/components/organisms/KYBView/views/CompanyActivityView/types';
import { CompanyInformationContext } from '@app/components/organisms/KYBView/views/CompanyInformationView/types';
import { HeadquartersContext } from '@app/components/organisms/KYBView/views/HeadquartersView/types';

export interface PersonalInformationContext {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName: string;
}

export interface DocumentsContext {
  registrationCertificate: string;
  addressProof: string;
}

export interface BusinessInformationContext {
  registrationNumber: string;
  website: string;
}

export interface BusinessAddressContext {
  address: string;
  country: string;
}

export interface UBOSContext {
  firstName: string;
  lastName: string;
  email: string;
}

export interface WorkflowFlowData extends ViewsData {
  shared: {
    endUserId?: string;
    businessId?: string;
  };
  flowData: {
    personal: PersonalInformationContext;
    company: CompanyInformationContext;
    headquarters: HeadquartersContext;
    companyActivity: CompanyActivityConext;
    bank: BankInformationContext;
    businessInformation: BusinessInformationContext;
    businessAddress: BusinessAddressContext;
    documents: DocumentsContext;
    ubos: UBOSContext[];
  };
}
