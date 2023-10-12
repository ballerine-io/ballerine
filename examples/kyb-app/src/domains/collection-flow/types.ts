import { Workflow } from '@app/domains/workflows/types';
import { AnyObject } from '@ballerine/ui';
import { RJSFSchema, UiSchema } from '@rjsf/utils';

export interface AuthorizeDto {
  email: string;
}

export interface GetSessionDto {
  email: string;
}

export interface TUser {
  id: string;
  email: string;
  businessId: string;
}

export interface GetActiveWorkflowDto {
  endUserId: string;
}

export interface FlowData {
  id: string;
  flowState: string | null;
  status: 'approve' | 'reject';
  isFinished: boolean;
  flowData: AnyObject;
  documents: Document[];
  workflow?: Workflow;
}

export interface TFlowStep {
  key: string;
  title: string;
  description: string;
  uiSchema: UiSchema;
  formSchema: RJSFSchema;
  defaultData: object;
  isFinal?: boolean;
}

export interface DocumentConfiguration {
  name: string;
  type: string;
}
export interface TFlowConfiguration {
  id: string;
  steps: TFlowStep[];
  documentConfigurations: DocumentConfiguration[];
}

export interface MainRepresentative {
  firstName: string;
  lastName: string;
  phone: string;
  dateOfBirth: string;
  companyName: string;
  email: string;
  title: string;
}

export interface Document {
  id?: string;
  fileId?: string;
  uri?: string;
  properties: object;
  category: string;
  type: string;
  decision?: {
    status?: string;
    revisionReason?: string;
    rejectionReason?: string;
  };
}

export interface UBO {
  id: string;
  firstName: string;
  lastName: string;
  title: string;
  birthDate: string;
  email: string;
}

export interface EntityData {
  website: string;
  registrationNumber: string;
  companyName: string;
  companyDisplayName: string;
  countryOfIncorporation: string;
  fullAddress: string;
}

export interface BusinessData {
  businessType?: string;
  companyName: string;
  registrationNumber: string;
  legalForm: string;
  country: string;
  countryOfIncorporation: string;
  dateOfIncorporation: string;
  address: string;
  phoneNumber: string;
  email: string;
  website: string;
  industry: string;
  taxIdentificationNumber: string;
  vatNumber: string;
}

export interface UpdateFlowDto {
  payload: {
    mainRepresentative: MainRepresentative;
    documents: Document[];
    ubos: UBO[];
    entityData: EntityData;
    flowState: string;
    dynamicData: object;
    businessData: BusinessData;
  };
}

export interface TCustomer {
  id: string;
  name: string;
  displayName: string;
  logoImageUri: string;
  customerStatus: string;
  country: string;
  language: string;
}
