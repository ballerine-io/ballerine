export interface WorkflowData {
  context: any;
  state: string;
}

export type TFindWorkflows = (entityId: string) => string[];

export type TGetWorkflows = (workflowId: string, entityId: string) => WorkflowData | undefined;

export type TPutWorkflow = (workflowId: string, entityId: string, data: WorkflowData) => void;

export type TRemoveWorkflow = (workflowId: string, entityId: string) => void;

export interface StoreAdapter {
  find: TFindWorkflows;
  get: TGetWorkflows;
  put: TPutWorkflow;
  remove: TRemoveWorkflow;
}
