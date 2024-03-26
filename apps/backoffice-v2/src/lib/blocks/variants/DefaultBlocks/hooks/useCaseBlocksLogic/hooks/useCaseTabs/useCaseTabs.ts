import { TCaseTabDefinition } from '@/lib/blocks/variants/DefaultBlocks/types/case-tab';
import { useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';

export const useCaseTabs = (tabs: TCaseTabDefinition[]) => {
  const [activeTabName, setActiveTabName] = useState(() => tabs?.at(0)?.name);

  const activeTab = useMemo(
    () => tabs?.find(tab => tab.name === activeTabName),
    [tabs, activeTabName],
  );

  const setActiveTab = useCallback(
    (tabName: string) => {
      if (!tabs.find(tab => tab.name === tabName)) {
        toast.warning(`Tab: ${tabName} not found`);

        return;
      }

      setActiveTabName(tabName);
    },
    [tabs],
  );

  return {
    activeTab,
    setActiveTab,
  };
};
