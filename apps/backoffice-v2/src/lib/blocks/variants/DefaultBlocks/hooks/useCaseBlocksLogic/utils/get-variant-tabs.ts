import { WorkflowDefinitionConfigTheme } from '@/domains/workflow-definitions/fetchers';
import { applyTabsOverride } from '@/lib/blocks/variants/DefaultBlocks/hooks/useCaseBlocksLogic/utils/apply-tabs-override';
import { TCaseTabDefinition } from '@/lib/blocks/variants/DefaultBlocks/types/case-tab';
import { WorkflowDefinitionConfigThemeEnum } from '@ballerine/common';

export const Tab = {
  SUMMARY: 'SUMMARY',
  KYB: 'KYB',
  STORE_INFO: 'STORE_INFO',
  DOCUMENTS: 'DOCUMENTS',
  INDIVIDUALS: 'INDIVIDUALS',
  ASSOCIATED_COMPANIES: 'ASSOCIATED_COMPANIES',
  DIRECTORS: 'DIRECTORS',
  MONITORING_REPORTS: 'MONITORING_REPORTS',
  KYC: 'KYC',
  CUSTOM_DATA: 'CUSTOM_DATA',
} as const;

export const getVariantTabs = (
  theme: WorkflowDefinitionConfigTheme,
  tabBlocks: Record<string, any[] | undefined>,
): TCaseTabDefinition[] => {
  if (theme?.type === WorkflowDefinitionConfigThemeEnum.KYB) {
    const baseTabs = [
      {
        name: Tab.SUMMARY,
        displayName: 'Summary',
        disabled: !tabBlocks[Tab.SUMMARY]?.length,
      },
      {
        name: Tab.KYB,
        displayName: 'KYB',
        disabled: !tabBlocks[Tab.KYB]?.length,
      },
      {
        name: Tab.INDIVIDUALS,
        displayName: 'Individuals',
        disabled: false,
      },
      {
        name: Tab.DOCUMENTS,
        displayName: 'Documents',
        disabled: !tabBlocks[Tab.DOCUMENTS]?.length,
      },
      {
        name: Tab.MONITORING_REPORTS,
        displayName: 'Web Presence',
        disabled: !tabBlocks[Tab.MONITORING_REPORTS]?.length,
      },
      {
        name: Tab.STORE_INFO,
        displayName: 'Store',
        disabled: !tabBlocks[Tab.STORE_INFO]?.length,
      },

      {
        name: Tab.ASSOCIATED_COMPANIES,
        displayName: 'Associated Companies',
        disabled: !tabBlocks[Tab.ASSOCIATED_COMPANIES]?.length,
      },

      {
        name: Tab.CUSTOM_DATA,
        displayName: 'Custom Data',
        disabled: !tabBlocks[Tab.CUSTOM_DATA]?.length,
        tooltip:
          'This tab displays customer data provided by API, allowing Ballerine AI to enrich its analysis.',
      },
    ];

    return applyTabsOverride(baseTabs, theme.tabsOverride);
  }

  if (theme?.type === WorkflowDefinitionConfigThemeEnum.DOCUMENTS_REVIEW) {
    const baseTabs = [
      {
        name: Tab.DOCUMENTS,
        displayName: 'Documents Review',
        hidden: true,
      },
    ];

    return applyTabsOverride(baseTabs, theme.tabsOverride);
  }

  if (theme?.type === WorkflowDefinitionConfigThemeEnum.KYC) {
    const baseTabs = [
      {
        name: Tab.KYC,
        displayName: 'KYC',
        hidden: true,
      },
    ];

    return applyTabsOverride(baseTabs, theme.tabsOverride);
  }

  return [];
};
