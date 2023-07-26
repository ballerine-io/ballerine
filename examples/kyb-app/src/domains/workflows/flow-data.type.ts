import { ViewsData } from '@app/common/providers/ViewStateProvider/hooks/useViewsDataRepository/types';

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
    personalInformation: PersonalInformationContext | null;
    businessInformation: BusinessInformationContext | null;
    businessAddress: BusinessAddressContext | null;
    documents: DocumentsContext | null;
    ubos: UBOSContext[] | null;
  };
}
