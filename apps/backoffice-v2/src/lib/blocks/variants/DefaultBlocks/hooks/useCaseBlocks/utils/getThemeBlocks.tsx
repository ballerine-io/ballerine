import { WorkflowDefinitionConfigTheme } from '@/domains/workflow-definitions/fetchers';
import { TCaseTabDefinition } from '@/lib/blocks/variants/DefaultBlocks/types/case-tab';

export const getThemeBlocks = (
  tabBlocks: Record<string, any[]>,
  theme: WorkflowDefinitionConfigTheme,
  activeTab?: TCaseTabDefinition,
) => {
  if (theme.type === 'kyb' && activeTab) {
    return tabBlocks[activeTab.name] || [];
  }

  return [];
};
