import { TCaseTabDefinition } from '@/lib/blocks/variants/DefaultBlocks/types/case-tab';

export const getVariantBlocks = (
  tabBlocks: Record<string, any[] | undefined>,
  activeTab?: TCaseTabDefinition,
) => {
  if (activeTab) {
    return tabBlocks[activeTab.name] || [];
  }

  return [];
};
