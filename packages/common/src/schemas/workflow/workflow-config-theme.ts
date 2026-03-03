import { WorkflowDefinitionConfigThemeEnum, WorkflowDefinitionConfigThemes } from '@/consts';
import { z } from 'zod';

export const WorkflowDefinitionConfigThemeSchema = z.object({
  type: z.enum(WorkflowDefinitionConfigThemes),
  tabsOverride: z.array(z.string()).optional(),
});
