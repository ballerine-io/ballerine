import { TCaseTabDefinition } from '@/lib/blocks/variants/DefaultBlocks/types/case-tab';
import { useCallback, useMemo, useState } from 'react';

export const useCaseTabsLogic = (tabs: TCaseTabDefinition[]) => {
  const [activeTabName, setActiveTabName] = useState<string | null>(() => {
    return tabs.length ? (tabs.at(0)?.name as string) : null;
  });

  console.log('tabs', tabs);
  const activeTab = useMemo(
    () => tabs?.find(tab => tab.name === activeTabName),
    [tabs, activeTabName],
  );

  const setTab = useCallback(
    (tabName: string) => {
      if (!tabs.find(tab => tab.name === tabName)) {
        console.warn(`Tab: ${tabName} not found`);

        return;
      }

      setActiveTabName(tabName);
    },
    [tabs],
  );

  return {
    activeTab,
    setTab,
  };
};
