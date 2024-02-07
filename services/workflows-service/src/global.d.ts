declare module '@prisma/client' {
  import type {
    WorkflowRuntimeData as _WorkflowRuntimeData,
    WorkflowDefinition as _WorkflowDefinition,
    Customer as Customer_,
    Alert as _Alert,
  } from '@prisma/client/index';
  export * from '@prisma/client/index';

  export type WorkflowRuntimeData = Omit<_WorkflowRuntimeData, 'context'> & {
    context: any;
    config: WorkflowConfig | any;
  };
  export type WorkflowDefinition = Omit<_WorkflowDefinition, 'config'> & {
    config: WorkflowConfig | any;
  };

  export type Alert = Omit<_Alert, 'executionDetails'> & {
    executionDetails: TCustomerSubscription | any;
  };
}
