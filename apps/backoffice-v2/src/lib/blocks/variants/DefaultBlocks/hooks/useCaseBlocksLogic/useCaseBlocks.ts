import { TWorkflowById } from '@/domains/workflows/fetchers';
import { useTabsToBlocksMap } from '@/lib/blocks/variants/DefaultBlocks/hooks/useCaseBlocksLogic/utils/useTabsToBlocksMap';
import { getVariantTabs } from '@/lib/blocks/variants/DefaultBlocks/hooks/useCaseBlocksLogic/utils/get-variant-tabs';
import { useMemo } from 'react';
import { z } from 'zod';
import { CaseTabsSchema } from '@/common/hooks/useSearchParamsByEntity/validation-schemas';
import { toScreamingSnakeCase } from '@/common/utils/to-screaming-snake-case/to-screaming-snake-case';
import { useEnsureActiveTabIsInTheme } from '@/lib/blocks/variants/DefaultBlocks/hooks/useEnsureActiveTabIsInTheme/useEnsureActiveTabIsInTheme';
import { TAllBlocks } from '../useDefaultBlocksLogic/constants';

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
  blocks: TAllBlocks;
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
  const theme = config?.theme;
  const tabBlocks = useTabsToBlocksMap({
    blocks,
    blocksCreationParams: { workflow, onReuploadNeeded, isLoadingReuploadNeeded },
    theme,
  });
  const tabBlocksByTab = tabBlocks as unknown as Record<string, any[]>;
  const tabs = useMemo(() => {
    if (!theme) {
      return [];
    }

    return getVariantTabs(theme, tabBlocksByTab as Record<string, any[] | undefined>);
  }, [theme, tabBlocksByTab]);
  const themeBlocks = useMemo(() => {
    if (!theme) {
      return [];
    }

    return tabBlocksByTab[toScreamingSnakeCase(activeTab)] ?? [];
  }, [activeTab, theme, tabBlocksByTab]);

  useEnsureActiveTabIsInTheme({
    tabBlocks: tabBlocksByTab as any,
    activeTab,
  });

  return {
    activeTab,
    blocks: themeBlocks,
    tabs,
  };
};
