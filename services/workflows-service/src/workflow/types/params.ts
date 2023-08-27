import { TProjectIds } from '@/types';

export interface FindLastActiveFlowParams {
  workflowDefinitionId: string;
  businessId: string;
  projectIds: TProjectIds;
}

export interface GetLastActiveFlowParams {
  email: string;
  workflowRuntimeDefinitionId: string;
  projectIds: TProjectIds;
}
