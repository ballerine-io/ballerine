import { TWorkflowById } from '@/domains/workflows/fetchers';
import { getTabsToBlocksMap } from '@/lib/blocks/variants/DefaultBlocks/hooks/useCaseBlocksLogic/utils/get-tabs-block-map';
import { getVariantTabs } from '@/lib/blocks/variants/DefaultBlocks/hooks/useCaseBlocksLogic/utils/get-variant-tabs';
import { Blocks } from '@ballerine/blocks';
import { useMemo } from 'react';
import { z } from 'zod';
import { CaseTabsSchema } from '@/common/hooks/useSearchParamsByEntity/validation-schemas';
import { toScreamingSnakeCase } from '@/common/utils/to-screaming-snake-case/to-screaming-snake-case';

export type TCaseBlocksLogicParams = {
  workflow: TWorkflowById;
  onReuploadNeeded: ({
    workflowId,
    documentId,
    reason,
  }: {
    workflowId: string;
    documentId: string;
    reason?: string;
  }) => () => void;
  isLoadingReuploadNeeded: boolean;
  blocks: Blocks;
  config: TWorkflowById['workflowDefinition']['config'];
  activeTab: z.output<typeof CaseTabsSchema>;
};

export const useCaseBlocks = ({
  workflow,
  onReuploadNeeded,
  isLoadingReuploadNeeded,
  blocks,
  config,
  activeTab,
}: TCaseBlocksLogicParams) => {
  const tabBlocks = useMemo(
    () =>
      getTabsToBlocksMap({
        blocks,
        blocksCreationParams: { workflow, onReuploadNeeded, isLoadingReuploadNeeded },
        theme: config?.theme,
      }),
    [workflow, blocks, onReuploadNeeded, isLoadingReuploadNeeded, config?.theme],
  );
  const tabs = useMemo(() => {
    if (!config?.theme) {
      return [];
    }

    return getVariantTabs(config.theme, tabBlocks);
  }, [tabBlocks, config?.theme]);

  const themeBlocks = useMemo(() => {
    if (!config?.theme) {
      return [];
    }

    return tabBlocks[toScreamingSnakeCase(activeTab)] ?? [];
  }, [config?.theme, activeTab, tabBlocks]);

  return {
    activeTab,
    blocks: themeBlocks,
    tabs,
  };
};
