import { AnyObject } from '@ballerine/ui';
import { RJSFSchema } from '@rjsf/utils';
import {CreateEndUserDto} from "@app/domains/end-user";
import {PersonalInformationContext} from "@app/components/organisms/KYBView/types";

export interface WorkflowUBO {
  entity: {
    type: 'individual';
    id: string;
    data: {
      firstName: string;
      lastName: string;
      email: string;
      additionalInfo?: Record<PropertyKey, unknown>;
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
    mainRepresentative: PersonalInformationContext,
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
        countryOfIncorporation: string;
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
          mainRepresentative: CreateEndUserDto,
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

export interface WorkflowDocumentPage {
  ballerineFileId: string;
}

export interface WorkflowDocument {
  id: string;
  type: string;
  category: string;
  decision: {
    status: string;
    revisionReason: string;
    rejectionReason: string;
  };
  issuer: {
    country: string;
  };
  propertiesSchema: RJSFSchema;
  pages: WorkflowDocumentPage[];
}

export interface Workflow {
  id: string;
  workflowDefinitionId: string;
  businessId: string;
  endUserId: string;
  context: {
    documents: WorkflowDocument[];
    entity: {
      ballerineEntityId: string;
      data: {
        address: {
          text: string;
        };
        website: string;
        registrationNumber: string;
        additionalInfo: {
          ubos: WorkflowUBO[];
        };
        companyName: string;
      };
    };
  };
}

export interface GetWorkflowResponse {
  workflowRuntimeData: Workflow;
}

export interface UpdateWorkflowDto {
  workflowId: string;
  payload: Workflow;
}
