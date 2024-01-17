import { WorkflowDefinitionVariant } from '@ballerine/common';
import { ObjectWithIdSchema } from '@/lib/zod/utils/object-with-id/object-with-id';
import { z } from 'zod';
import { apiClient } from '@/common/api-client/api-client';
import { Method } from '@/common/enums';
import { handleZodError } from '@/common/utils/handle-zod-error/handle-zod-error';
import { env } from '@/common/env/env';
import { getOriginUrl } from '@/common/utils/get-origin-url/get-url-origin';

import { ProcessStatuses } from '@/common/components/molecules/ProcessTracker/constants';

export const WorkflowDefinitionConfigSchema = z
  .object({
    isManualCreation: z.boolean().default(false),
  })
  .passthrough()
  .nullable();

export const PluginSchema = z.object({
  name: z.string(),
  displayName: z.string().or(z.undefined()),
  status: z.enum(ProcessStatuses),
});

export type TPlugin = z.infer<typeof PluginSchema>;

export const WorkflowDefinitionByIdSchema = ObjectWithIdSchema.extend({
  name: z.string(),
  version: z.number(),
  variant: z.string().default(WorkflowDefinitionVariant.DEFAULT),
  contextSchema: z.record(z.any(), z.any()).nullable(),
  documentsSchema: z.array(z.any()).optional().nullable(),
  config: WorkflowDefinitionConfigSchema,
  definition: z
    .object({
      // transitionSchema: z
      //   .array(
      //     z.object({
      //       state: z.string(),
      //       schema: z.record(z.any(), z.unknown()),
      //       additionalParameters: z.record(z.any(), z.unknown()).optional(),
      //     }),
      //   )
      //   .nullable(),
    })
    .passthrough(),
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
