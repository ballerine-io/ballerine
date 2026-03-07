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
  KYC_PROFILE: 'KYC_PROFILE',
  KYC_DOCUMENTS: 'KYC_DOCUMENTS',
  KYC_VERIFICATION: 'KYC_VERIFICATION',
  KYC_AML: 'KYC_AML',
  KYC_CUSTOM_DATA: 'KYC_CUSTOM_DATA',
  CUSTOM_DATA: 'CUSTOM_DATA',
} as const;

export const getVariantTabs = (
  theme: WorkflowDefinitionConfigTheme,
  _tabBlocks: Record<string, any[] | undefined>,
): TCaseTabDefinition[] => {
  if (theme?.type === WorkflowDefinitionConfigThemeEnum.KYB) {
    const baseTabs = [
      {
        name: Tab.SUMMARY,
        displayName: 'Summary',
        disabled: false,
      },
      {
        name: Tab.KYB,
        displayName: 'KYB',
        disabled: false,
      },
      {
        name: Tab.INDIVIDUALS,
        displayName: 'Individuals',
        disabled: false,
      },
      {
        name: Tab.DOCUMENTS,
        displayName: 'Documents',
        disabled: false,
      },
      {
        name: Tab.MONITORING_REPORTS,
        displayName: 'Web Presence',
        disabled: false,
      },
      {
        name: Tab.STORE_INFO,
        displayName: 'Store',
        disabled: false,
      },

      {
        name: Tab.ASSOCIATED_COMPANIES,
        displayName: 'Associated Companies',
        disabled: false,
      },

      {
        name: Tab.CUSTOM_DATA,
        displayName: 'Custom Data',
        disabled: false,
        tooltip: 'This tab displays custom data provided via API to enrich the case analysis.',
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
        name: Tab.KYC_PROFILE,
        displayName: 'Profile',
        disabled: !_tabBlocks[Tab.KYC_PROFILE]?.length,
      },
      {
        name: Tab.KYC_DOCUMENTS,
        displayName: 'Documents',
        disabled: !_tabBlocks[Tab.KYC_DOCUMENTS]?.length,
      },
      {
        name: Tab.KYC_VERIFICATION,
        displayName: 'Verification',
        disabled: !_tabBlocks[Tab.KYC_VERIFICATION]?.length,
      },
      {
        name: Tab.KYC_AML,
        displayName: 'AML',
        disabled: !_tabBlocks[Tab.KYC_AML]?.length,
      },
      {
        name: Tab.KYC_CUSTOM_DATA,
        displayName: 'Custom Data',
        disabled: !_tabBlocks[Tab.KYC_CUSTOM_DATA]?.length,
      },
    ];

    return applyTabsOverride(baseTabs, theme.tabsOverride);
  }

  return [];
};
