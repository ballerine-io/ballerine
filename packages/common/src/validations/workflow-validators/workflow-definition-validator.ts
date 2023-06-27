import { z } from 'zod';
import { ApiPluginSchema } from "./api-plugin.validator";
import { WebhookPluginSchema } from "./webhook-plugin.validator";
import { AnyRecord } from "@/types";
import { zodErrorToReadable } from "../../utils/zod-error-to-readable";

const ApiOrWebhookSchema = z.union([ApiPluginSchema, WebhookPluginSchema]);

const WorkflowDefinitionSchema = z.object({
  extensions: z.object({
    statePlugins: z.array(z.record(z.any())).optional(),
    apiPlugins: z.array(ApiOrWebhookSchema).optional(),
  }).optional(),
}).optional();
export const validateWorkflowDefinition = (workflowDefinition: AnyRecord) => {
  const parseResult = WorkflowDefinitionSchema.safeParse(workflowDefinition);

  if (!parseResult.success) {
    return {isValid: false, error: zodErrorToReadable(parseResult.error)};
  }
  return { isValid: true, error: undefined };
}

export const validWorkflowDefinitionOrThrow = (workflowDefinition: AnyRecord) => {
  const parseResult = WorkflowDefinitionSchema.parse(workflowDefinition);

  return parseResult;
}

