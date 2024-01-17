import { WorkflowDefinition } from '@prisma/client';

export interface ITransitionSchema {
  state: string;
  schema: Record<PropertyKey, unknown>;
  additionalParameters?: Record<PropertyKey, unknown>;
}

export type TWorkflowDefinitionWithTransitionSchema = WorkflowDefinition & {
  definition: WorkflowDefinition['definition'] & {
    transitionSchema?: ITransitionSchema[] | null;
    initial?: string;
  };
};
