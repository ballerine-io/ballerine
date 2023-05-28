declare module '@prisma/client' {
  import type {
    WorkflowRuntimeData as _WorkflowRuntimeData,
    WorkflowDefinition as _WorkflowDefinition,
  } from '@prisma/client/index';
  export * from '@prisma/client/index';
  export type WorkflowRuntimeData = Omit<_WorkflowRuntimeData, 'context'> & { context: any };
  export type WorkflowDefinition = Omit<_WorkflowDefinition, 'config'> & {
    config: { completedWhenTasksResolved?: boolean } | any;
  };
}
