import { AnyObject } from '@ballerine/ui';
import { RJSFSchema } from '@rjsf/utils';

export interface WorkflowUBO {
  entity: {
    type: 'individual';
    data: {
      firstName: string;
      lastName: string;
      email: string;
    };
  };
}

export interface WorkflowRunDocument {
  country: string;
  type: string;
  category: string;
  pages: {
    fileId: string;
  }[];
}

export interface RunWorkflowDto {
  workflowId: string;
  endUserId: string;
  businessId: string;
  entity: {
    type: 'business';
    website: string;
    companyName: string;
    address: string;
    registrationNumber: string;
    customerCompany: string;
    ubos: WorkflowUBO[];
  };
  documents: WorkflowRunDocument[];
}

export interface TRunWorkflowDocument {
  type: string;
  category: string;
  issuer: {
    country: string;
  };
  pages: { ballerineFileId: string }[];
  properies: AnyObject;
  version: string;
  issuingVersion: number;
}

export interface TRunWorkflowDto {
  workflowId: string;
  context: {
    entity: {
      id?: string;
      endUserId: string;
      ballerineEntityId: string;
      type: 'business';
      data: {
        website: string;
        correlationId?: string;
        companyName: string;
        address: {
          street?: string;
          postalCode?: string;
          city?: string;
          countryCode?: string;
          country?: string;
          text?: string;
          address?: string;
        };
        registrationNumber: string;
        additionalInfo?: {
          companyName: string;
          customerCompany: 'Ballerine';
          ubos: WorkflowUBO[];
        };
      };
    };
    documents: TRunWorkflowDocument[];
  };
}

export interface GetWofklowDto {
  id: string;
}

export interface WorkflowDocument {
  id: string;
  decision: {
    status: string;
    revisionReason: string;
    rejectionReason: string;
  };
  propertiesSchema: RJSFSchema;
}

export interface Workflow {
  id: string;
  documents: WorkflowDocument[];
}

export interface GetWorkflowResponse {
  workflowRuntimeData: Workflow;
}
