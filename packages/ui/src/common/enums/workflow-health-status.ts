export const WorkflowHealthStatus = {
  healthy: 'healthy',
  failed: 'failed',
  pending: 'pending',
  'pending-longterm': 'pending-longterm',
} as const;

export type IWorkflowHealthStatus = keyof typeof WorkflowHealthStatus;
