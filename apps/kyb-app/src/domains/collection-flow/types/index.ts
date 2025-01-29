import { ITheme } from '@/common/types/settings';
import { Action, Rule, UIElement } from '@/domains/collection-flow/types/ui-schema.types';
import { IPlugin } from '@/pages/CollectionFlow/versions/v2/components/organisms/CollectionFlowUI/components/utility/PluginsRunner/types';
import { AnyObject, IFormElement } from '@ballerine/ui';
import { RJSFSchema, UiSchema } from '@rjsf/utils';
import { CollectionFlowConfig } from './flow-context.types';

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
  pages?: Array<{ ballerineFileId: string }>;
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

export type UIElementV1<TParams = any> = UIElement<TParams>;
export type UIElementV2<TElements = any, TParams = any> = IFormElement<any, any>;

export interface UIPage<TVersion extends 'v1' | 'v2' = 'v1'> {
  type: 'page';
  name: string;
  number: number;
  stateName: string;
  elements: Array<TVersion extends 'v1' ? UIElementV1<any> : UIElementV2<any>>;
  plugins: IPlugin[];
  actions: Action[];
  pageValidation?: Rule[];
}

export interface UISchemaConfig extends CollectionFlowConfig {
  kybOnExitAction?: 'send-event' | 'redirect-to-customer-portal';
  supportedLanguages: string[];
}

export interface UIOptions {
  redirectUrls?: {
    success?: string;
    failure?: string;
  };
}

export interface UISchema {
  id: string;
  config: UISchemaConfig;
  uiSchema: {
    elements: UIPage[];
    theme: ITheme;
  };
  definition: {
    definitionType: string;
    definition: AnyObject;
    extensions: AnyObject;
  };
  uiOptions?: UIOptions;
  version: number;
}

export * from './ui-schema.types';
