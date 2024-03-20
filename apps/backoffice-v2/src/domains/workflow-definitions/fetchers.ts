import { apiClient } from '@/common/api-client/api-client';
import { Method } from '@/common/enums';
import { env } from '@/common/env/env';
import { getOriginUrl } from '@/common/utils/get-origin-url/get-url-origin';
import { handleZodError } from '@/common/utils/handle-zod-error/handle-zod-error';
import { ObjectWithIdSchema } from '@/lib/zod/utils/object-with-id/object-with-id';
import { WorkflowDefinitionVariant } from '@ballerine/common';
import { z } from 'zod';

export const PluginSchema = z.object({
  name: z.string(),
  displayName: z.string().or(z.undefined()),
});

export type TPlugin = z.infer<typeof PluginSchema>;

export const WorkflowDefinitionConfigTheme = z.object({
  type: z.union([z.literal('kyb'), z.literal('kyc'), z.literal('documents-review')]),
  tabsOverride: z.array(z.string()).optional(),
});

export type WorkflowDefinitionConfigTheme = z.infer<typeof WorkflowDefinitionConfigTheme>;

export const WorkflowDefinitionConfigSchema = z
  .object({
    enableManualCreation: z.boolean().default(false),
    isManualCreation: z.boolean().default(false),
    isAssociatedCompanyKybEnabled: z.boolean().default(false),
    theme: WorkflowDefinitionConfigTheme.default({
      type: 'kyb',
    }),
  })
  .passthrough()
  .nullable();

export const WorkflowDefinitionByIdSchema = ObjectWithIdSchema.extend({
  name: z.string(),
  displayName: z.string().nullable().optional(),
  version: z.number(),
  variant: z.string().default(WorkflowDefinitionVariant.DEFAULT),
  contextSchema: z.record(z.any(), z.any()).nullable(),
  documentsSchema: z.array(z.any()).optional().nullable(),
  config: WorkflowDefinitionConfigSchema,
  definition: z.record(z.string(), z.unknown()),
  extensions: z
    .object({
      apiPlugins: z.array(PluginSchema).optional(),
      commonPlugins: z.array(PluginSchema).optional(),
      childWorkflowPlugins: z.array(PluginSchema).optional(),
    })
    .optional()
    .nullable(),
});

export type TWorkflowDefinitionById = z.infer<typeof WorkflowDefinitionByIdSchema>;

export const fetchWorkflowDefinitionById = async ({
  workflowDefinitionId,
}: {
  workflowDefinitionId: string;
}) => {
  const [workflowDefinition, error] = await apiClient({
    method: Method.GET,
    url: `${getOriginUrl(
      env.VITE_API_URL,
    )}/api/v1/external/workflows/workflow-definition/${workflowDefinitionId}`,
    schema: WorkflowDefinitionByIdSchema,
  });

  return handleZodError(error, workflowDefinition);
};
