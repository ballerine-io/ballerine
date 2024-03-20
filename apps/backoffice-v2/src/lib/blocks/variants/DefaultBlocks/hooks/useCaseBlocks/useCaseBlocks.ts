import { TWorkflowById } from '@/domains/workflows/fetchers';
import { useCaseTabs } from '@/lib/blocks/variants/DefaultBlocks/hooks/useCaseBlocks/hooks/useCaseTabs/useCaseTabs';
import { getTabsToBlocksMap } from '@/lib/blocks/variants/DefaultBlocks/hooks/useCaseBlocks/utils/getTabsToBlocksMap';
import { getVariantBlocks } from '@/lib/blocks/variants/DefaultBlocks/hooks/useCaseBlocks/utils/getVariantBlocks';
import { getVariantTabs } from '@/lib/blocks/variants/DefaultBlocks/hooks/useCaseBlocks/utils/getVariantTabs';
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
    () =>
      getTabsToBlocksMap(
        allBlocks,
        { workflow, onReuploadNeeded, isLoadingReuploadNeeded },
        config?.theme,
      ),
    [workflow, allBlocks, onReuploadNeeded, isLoadingReuploadNeeded, config?.theme],
  );
  const tabs = useMemo(
    () => (config?.theme ? getVariantTabs(config.theme, tabBlocks) : []),
    [tabBlocks, config?.theme],
  );
  const { activeTab, setTab } = useCaseTabs(tabs);

  const themeBlocks = useMemo(
    () => (config?.theme ? getVariantBlocks(tabBlocks, activeTab) : []),
    [config?.theme, activeTab, tabBlocks],
  );

  return {
    activeTab,
    blocks: themeBlocks,
    tabs,
    setTab,
  };
};
