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
  information: {
    registrationNumber: string;
    website: string;
  };
  address: {
    address: string;
  };
  documents: {
    registrationCertificate: string;
    addressProof: string;
  };
  shareholders: {
    firstName: string;
    lastName: string;
    email: string;
  }[];
}

export interface KYBContext {
  state: SchemaStates<typeof kybViewSchema>;
  personalInformation: PersonalInformationContext | null;
  documents: DocumentsContext | null;
  shared: {
    endUserId?: string;
    businessId?: string;
  };
}

export interface KYBQueryParams {
  workflowRuntimeId?: string;
}
