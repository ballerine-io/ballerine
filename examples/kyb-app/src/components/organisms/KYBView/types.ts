import { SchemaStates } from '@app/common/providers/ViewStateProvider';
import { kybViewSchema } from '@app/components/organisms/KYBView/kyb-view.schema';

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

export interface KYBContext {
  state: string;
  personalInformation: PersonalInformationContext | null;
  businessInformation: BusinessInformationContext | null;
  businessAddress: BusinessAddressContext | null;
  documents: DocumentsContext | null;
  ubos: UBOSContext[] | null;
  shared: {
    endUserId?: string;
    businessId?: string;
  };
}

export interface KYBQueryParams {
  workflowRuntimeId?: string;
}
