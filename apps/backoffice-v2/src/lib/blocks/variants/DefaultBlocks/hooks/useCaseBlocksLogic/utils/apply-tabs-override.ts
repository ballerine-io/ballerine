import { TCaseTabDefinition } from '@/lib/blocks/variants/DefaultBlocks/types/case-tab';

export const applyTabsOverride = (tabs: TCaseTabDefinition[], tabsOverride?: string[]) => {
  if (!tabsOverride?.length) {
    return tabs;
  }

  return tabsOverride.map(tabName => tabs.find(tab => tab.name === tabName)).filter(Boolean);
};
