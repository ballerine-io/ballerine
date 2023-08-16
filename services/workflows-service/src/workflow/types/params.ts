export interface FindLastActiveFlowParams {
  workflowDefinitionId: string;
  businessId: string;
}

export interface GetLastActiveFlowParams {
  endUserId: string;
  workflowRuntimeDefinitionId: string;
}
