declare module '@prisma/client' {
  import type { WorkflowRuntimeData as _WorkflowRuntimeData } from '@prisma/client/index';
  export * from '@prisma/client/index';
  export type WorkflowRuntimeData = Omit<_WorkflowRuntimeData, 'context'> & { context: any };
}

type Unpacked<T> = T extends (infer U)[] ? U : T;
