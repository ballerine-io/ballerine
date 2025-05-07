import { ITheme } from '@/common/types/settings';
import { Action, Rule, UIElement } from '@/domains/collection-flow/types/ui-schema.types';
import { IPlugin } from '@/pages/CollectionFlow/versions/v2/components/organisms/CollectionFlowUI/components/utility/PluginsRunner/types';
import {
  AnyObject,
  ICommonValidator,
  IFormElement,
  TDocumentDecision,
  TDocumentStatus,
} from '@ballerine/ui';
import { RJSFSchema, UiSchema } from '@rjsf/utils';
import { z } from 'zod';
import { CollectionFlowConfig, CollectionFlowContext } from './flow-context.types';

export * from './ui-schema.types';

export interface TUser {
  id: string;
  email: string;
  businessId: string;
}

export interface EndUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface FlowContextResponse {
  context: CollectionFlowContext;
  config: CollectionFlowConfig;
}

export interface CreateEndUserDto {
  email: string;
  firstName: string;
  lastName: string;
  additionalInfo?: Record<string, unknown>;
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
  globalValidate?: ICommonValidator[];
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
  disableLanguageSelection?: boolean;
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
  metadata: {
    businessId: string;
  };
}

export interface IDocumentRecord {
  id: string;
  status: TDocumentStatus;
  decision: TDocumentDecision;
  type: string;
  category: string;
  decisionReason?: string;
  comment?: string;
}

export const UpdateEndUserPluginDataSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  additionalInfo: z.object({
    title: z.string().min(1),
  }),
});

export type TUpdateEndUserPluginData = z.infer<typeof UpdateEndUserPluginDataSchema>;

export const FetchCompanyInformationPluginDataSchema = z
  .object({
    registrationNumber: z.string().min(1),
    countryCode: z.string().min(2),
    state: z.union([z.string().optional(), z.null()]),
    vendor: z.enum(['open-corporates']).optional(),
  })
  .transform(data => ({
    ...data,
    state: data.state || '',
  }));

export type TFetchCompanyInformationPluginData = z.infer<
  typeof FetchCompanyInformationPluginDataSchema
>;

export const FetchCompanyInformationResultSchema = z
  .object({
    name: z.string(),
    companyNumber: z.string(),
    vat: z.string().optional(),
    numberOfEmployees: z.number().optional(),
    companyType: z.string(),
    currentStatus: z.string(),
    jurisdictionCode: z.string(),
    incorporationDate: z.string(),
  })
  .transform(data => ({
    companyName: data.name,
    taxIdentificationNumber: data.vat,
    businessType: data.companyType,
    additionalInfo: {
      status: data.currentStatus,
      incorporationDate: data.incorporationDate,
      openCorporate: data,
    },
  }));
