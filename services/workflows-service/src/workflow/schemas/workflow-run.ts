import { defaultInputContextSchema, WorkflowRuntimeConfigSchema } from '@ballerine/common';
import { Type } from '@sinclair/typebox';

export const WorkflowRunSchema = Type.Object({
  workflowId: Type.String(),
  context: defaultInputContextSchema,
  config: Type.Optional(WorkflowRuntimeConfigSchema),
  salesforceObjectName: Type.Optional(Type.String()),
  salesforceRecordId: Type.Optional(Type.String()),
});
