import { TWorkflowById } from '@/domains/workflows/fetchers';
import { useCaseTabs } from '@/lib/blocks/variants/DefaultBlocks/hooks/useCaseBlocks/hooks/useCaseTabs/useCaseTabs';
import { getTabsToBlocksMap } from '@/lib/blocks/variants/DefaultBlocks/hooks/useCaseBlocks/utils/getTabsToBlocksMap';
import { getThemeBlocks } from '@/lib/blocks/variants/DefaultBlocks/hooks/useCaseBlocks/utils/getThemeBlocks';
import { getThemeTabs } from '@/lib/blocks/variants/DefaultBlocks/hooks/useCaseBlocks/utils/getThemeTabs';
import { useMemo } from 'react';

export type TCaseBlocksCreationProps = {
  workflow: TWorkflowById;
  onReuploadNeeded: any;
  isLoadingReuploadNeeded: boolean;
};

export const useCaseBlocks = (
  allBlocks: any[],
  config: TWorkflowById['workflowDefinition']['config'],
  { workflow, onReuploadNeeded, isLoadingReuploadNeeded }: TCaseBlocksCreationProps,
) => {
  const tabBlocks = useMemo(
    () => getTabsToBlocksMap(allBlocks, { workflow, onReuploadNeeded, isLoadingReuploadNeeded }),
    [workflow, allBlocks, onReuploadNeeded, isLoadingReuploadNeeded],
  );
  const tabs = useMemo(
    () => (config?.theme ? getThemeTabs(config.theme, tabBlocks) : []),
    [tabBlocks, config?.theme],
  );
  const { activeTab, setTab } = useCaseTabs(tabs);

  const themeBlocks = useMemo(
    () => (config?.theme ? getThemeBlocks(tabBlocks, config.theme, activeTab) : []),
    [config?.theme, activeTab, tabBlocks],
  );

  return {
    activeTab,
    blocks: themeBlocks,
    tabs,
    setTab,
  };
};
