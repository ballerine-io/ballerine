import { TWorkflowById } from '@/domains/workflows/fetchers';
import { useCaseTabs } from '@/lib/blocks/variants/DefaultBlocks/hooks/useCaseBlocks/hooks/useCaseTabs/useCaseTabs';
import { getThemeBlocks } from '@/lib/blocks/variants/DefaultBlocks/hooks/useCaseBlocks/utils/getThemeBlocks';
import { getThemeTabs } from '@/lib/blocks/variants/DefaultBlocks/hooks/useCaseBlocks/utils/getThemeTabs';
import { useMemo } from 'react';

export const useCaseBlocks = (
  allBlocks: any[],
  config: TWorkflowById['workflowDefinition']['config'],
) => {
  const tabs = useMemo(() => (config?.theme ? getThemeTabs(config.theme) : []), []);
  const { activeTab, setTab } = useCaseTabs(tabs);

  const themeBlocks = useMemo(
    () => (config?.theme ? getThemeBlocks(allBlocks, config.theme, activeTab) : []),
    [allBlocks, config?.theme, activeTab],
  );

  return {
    activeTab,
    blocks: themeBlocks,
    tabs,
    setTab,
  };
};
