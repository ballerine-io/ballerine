import { useCallback, useMemo, useState } from 'react';

export type TCaseTabDefinition = {
  name: string;
  displayName: string;
  blocks: any[];
};

export const useCaseTabs = (tabs: TCaseTabDefinition[], initialTab?: string) => {
  const [activeTabName, setActiveTabName] = useState<string>(() => {
    return initialTab ? initialTab : (tabs.at(0)?.name as string);
  });

  const activeTab = useMemo(
    () => tabs.find(tab => tab.name === activeTabName)!,
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
    blocks: activeTab?.blocks,
    setTab,
  };
};
