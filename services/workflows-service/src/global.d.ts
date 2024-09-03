declare module '@prisma/client' {
  import type {
    WorkflowRuntimeData as _WorkflowRuntimeData,
    WorkflowDefinition as _WorkflowDefinition,
    Alert as _Alert,
  } from '@prisma/client/index';
  import type { WorkflowConfig } from '@/workflow/schemas/zod-schemas';
  import type { TWorkflowExtenstion } from '@/workflow/schemas/extenstions.schemas';
  import type { TCustomerConfig, TCustomerSubscription } from '@/customer/schemas/zod-schemas';
  export * from '@prisma/client/index';

  export type WorkflowRuntimeData = Omit<_WorkflowRuntimeData, 'context'> & {
    context: any;
    config: WorkflowConfig | any;
  };

  type __WorkflowDefinition = Omit<_WorkflowDefinition, 'config'> & {
    config: WorkflowConfig | any;
  };

  export type WorkflowDefinition = Omit<__WorkflowDefinition, 'extensions'> & {
    extensions: TWorkflowExtenstion;
  };

  export type Customer = Omit<_Customer, 'subscriptions'> & {
    config: TCustomerConfig | any;
    subscriptions: TCustomerSubscription | any;
  };

  export type Alert = Omit<_Alert, 'executionDetails'> & {
    executionDetails: TCustomerSubscription | any;
  };
}
