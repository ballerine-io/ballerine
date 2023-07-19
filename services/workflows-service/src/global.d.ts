declare module '@prisma/client' {
  import type {
    WorkflowDefinition as _WorkflowDefinition,
    WorkflowRuntimeData as _WorkflowRuntimeData,
  } from '@prisma/client/index';
  export * from '@prisma/client/index';

  export type WorkflowRuntimeData = Omit<_WorkflowRuntimeData, 'context'> & {
    context: any;
    config: WorkflowConfig | any;
  };
  export type WorkflowDefinition = Omit<_WorkflowDefinition, 'config'> & {
    config: WorkflowConfig | any;
  };
}
