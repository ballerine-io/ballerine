export interface IAccessTokenContext {
  workflowId: string | null;
  accessToken: string | null;
  setWorkflowId: (workflowId: string) => void;
  setAccessToken: (accessToken: string) => void;
}
