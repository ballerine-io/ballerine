import { Action, Rule, UIElement } from '@/domains/collection-flow/types/ui-schema.types';
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
  pages?: { ballerineFileId: string }[];
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
  faviconImageUri: string;
  customerStatus: string;
  country: string;
  language: string;
  websiteUrl: string;
}

export interface UIPage {
  type: 'page';
  name: string;
  number: number;
  stateName: string;
  elements: UIElement<AnyObject>[];
  actions: Action[];
  pageValidation?: Rule[];
}

export interface UISchema {
  id: string;
  uiSchema: {
    elements: UIPage[];
  };
  definition: {
    definitionType: string;
    definition: AnyObject;
    extensions: AnyObject;
  };
}

export * from './ui-schema.types';
