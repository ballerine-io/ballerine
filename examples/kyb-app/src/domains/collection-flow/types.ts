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
  businesses: { id: string }[];
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
export interface TFlowConfiguration {
  id: string;
  steps: TFlowStep[];
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
  fileId: string;
  properties: object;
  category: string;
  type: string;
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
  countryOfIncorporation: string;
  fullAddress: string;
}
export interface UpdateFlowDto {
  flowType: string;
  flowId: string;
  payload: {
    mainRepresentative: MainRepresentative;
    documents: Document[];
    ubos: UBO[];
    entityData: EntityData;
    flowState: string;
    dynamicData: object;
  };
}
