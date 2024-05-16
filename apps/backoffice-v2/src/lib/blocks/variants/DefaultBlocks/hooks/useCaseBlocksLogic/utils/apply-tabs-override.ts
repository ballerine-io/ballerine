import { TCaseTabDefinition } from '@/lib/blocks/variants/DefaultBlocks/types/case-tab';

export const applyTabsOverride = (tabs: TCaseTabDefinition[], tabsOverride?: string[]) =>
  tabsOverride?.length
    ? tabsOverride.map(tabName => tabs.find(tab => tab.name === tabName)!).filter(Boolean)
    : tabs;
