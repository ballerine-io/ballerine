export interface SigninCredentials {
  email: string;
  flowType: string;
}

export interface GetActiveFlowParams {
  endUserId: string;
  workflowRuntimeDefinitionId: string;
}
