import { TProjectIds } from '@/types';

export interface FindLastActiveFlowParams {
  workflowDefinitionId: string;
  businessId: string;
}

export interface GetLastActiveFlowParams {
  email: string;
  workflowRuntimeDefinitionId: string;
  projectIds: TProjectIds;
}
