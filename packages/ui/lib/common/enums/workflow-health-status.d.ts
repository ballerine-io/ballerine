export declare const WorkflowHealthStatus: {
  readonly healthy: 'healthy';
  readonly failed: 'failed';
  readonly pending: 'pending';
  readonly 'pending-longterm': 'pending-longterm';
};
export type IWorkflowHealthStatus = keyof typeof WorkflowHealthStatus;
