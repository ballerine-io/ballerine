import { TWorkflowExtenstion } from '@/workflow/schemas/extenstions.schemas';
import { WorkflowDefinition } from '@prisma/client';

export interface IDefinitionStateSchema<TSchema = Record<PropertyKey, unknown>> {
  dataSchema: TSchema;
  [k: string]: unknown;
}

export type TWorkflowDefinitionWithTransitionSchema = WorkflowDefinition & {
  definition: WorkflowDefinition['definition'] & {
    initial?: string;
    states: Record<
      PropertyKey,
      {
        meta?: {
          inputSchema?: IDefinitionStateSchema;
        };
      }
    >;
  };
} & {
  extenstions: WorkflowDefinition['extenstions'] & TWorkflowExtenstion;
};
