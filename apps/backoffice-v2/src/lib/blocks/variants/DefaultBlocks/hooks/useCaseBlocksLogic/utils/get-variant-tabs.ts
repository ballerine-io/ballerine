import { WorkflowDefinitionConfigTheme } from '@/domains/workflow-definitions/fetchers';
import { applyTabsOverride } from '@/lib/blocks/variants/DefaultBlocks/hooks/useCaseBlocksLogic/utils/apply-tabs-override';
import { TCaseTabDefinition } from '@/lib/blocks/variants/DefaultBlocks/types/case-tab';
import { WorkflowDefinitionConfigThemeEnum } from '@ballerine/common';

export const Tab = {
  SUMMARY: 'SUMMARY',
  COMPANY_INFORMATION: 'COMPANY_INFORMATION',
  STORE_INFO: 'STORE_INFO',
  DOCUMENTS: 'DOCUMENTS',
  UBOS: 'UBOS',
  ASSOCIATED_COMPANIES: 'ASSOCIATED_COMPANIES',
  DIRECTORS: 'DIRECTORS',
  MONITORING_REPORTS: 'MONITORING_REPORTS',
  KYC: 'KYC',
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
        name: Tab.COMPANY_INFORMATION,
        displayName: 'Company Information',
        disabled: !tabBlocks[Tab.COMPANY_INFORMATION]?.length,
      },
      {
        name: Tab.STORE_INFO,
        displayName: 'Store Info',
        disabled: !tabBlocks[Tab.STORE_INFO]?.length,
      },
      {
        name: Tab.DOCUMENTS,
        displayName: 'Documents',
        disabled: !tabBlocks[Tab.DOCUMENTS]?.length,
      },
      {
        name: Tab.UBOS,
        displayName: 'UBOs',
        disabled: !tabBlocks[Tab.UBOS]?.length,
      },
      {
        name: Tab.ASSOCIATED_COMPANIES,
        displayName: 'Associated Companies',
        disabled: !tabBlocks[Tab.ASSOCIATED_COMPANIES]?.length,
      },
      {
        name: Tab.DIRECTORS,
        displayName: 'Directors',
        disabled: !tabBlocks[Tab.DIRECTORS]?.length,
      },
      {
        name: Tab.MONITORING_REPORTS,
        displayName: 'Monitoring Reports',
        disabled: !tabBlocks[Tab.MONITORING_REPORTS]?.length,
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
