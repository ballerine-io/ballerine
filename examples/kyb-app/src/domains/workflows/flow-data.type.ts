import { ViewsData } from '@app/common/providers/ViewStateProvider/hooks/useViewsDataRepository/types';
import { AnyObject } from '@ballerine/ui';

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
  flowData: AnyObject;
}
