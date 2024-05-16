import { TWorkflowById } from '@/domains/workflows/fetchers';
import { useCaseTabs } from '@/lib/blocks/variants/DefaultBlocks/hooks/useCaseBlocksLogic/hooks/useCaseTabs/useCaseTabs';
import { getTabsToBlocksMap } from '@/lib/blocks/variants/DefaultBlocks/hooks/useCaseBlocksLogic/utils/get-tabs-block-map';
import { getVariantBlocks } from '@/lib/blocks/variants/DefaultBlocks/hooks/useCaseBlocksLogic/utils/get-variant-blocks';
import { getVariantTabs } from '@/lib/blocks/variants/DefaultBlocks/hooks/useCaseBlocksLogic/utils/get-variant-tabs';
import { Blocks } from '@ballerine/blocks';
import { useMemo } from 'react';

export type TCaseBlocksLogicParams = {
  workflow: TWorkflowById;
  onReuploadNeeded: any;
  isLoadingReuploadNeeded: boolean;
  blocks: Blocks;
  config: TWorkflowById['workflowDefinition']['config'];
};

export const useCaseBlocks = ({
  workflow,
  onReuploadNeeded,
  isLoadingReuploadNeeded,
  blocks,
  config,
}: TCaseBlocksLogicParams) => {
  const tabBlocks = useMemo(
    () =>
      getTabsToBlocksMap(
        blocks,
        { workflow, onReuploadNeeded, isLoadingReuploadNeeded },
        config?.theme,
      ),
    [workflow, blocks, onReuploadNeeded, isLoadingReuploadNeeded, config?.theme],
  );
  const tabs = useMemo(
    () => (config?.theme ? getVariantTabs(config.theme, tabBlocks) : []),
    [tabBlocks, config?.theme],
  );
  const { activeTab, setActiveTab } = useCaseTabs(tabs);

  const themeBlocks = useMemo(
    () => (config?.theme ? getVariantBlocks(tabBlocks, activeTab) : []),
    [config?.theme, activeTab, tabBlocks],
  );

  return {
    activeTab,
    blocks: themeBlocks,
    tabs,
    setActiveTab,
  };
};
