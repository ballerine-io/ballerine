import { WorkflowDefinitionConfigTheme } from '@/domains/workflow-definitions/fetchers';
import { TCaseTabDefinition } from '@/lib/blocks/variants/DefaultBlocks/types/case-tab';

export const getThemeTabs = (
  theme: WorkflowDefinitionConfigTheme,
  tabBlocks: Record<string, any[]>,
): TCaseTabDefinition[] => {
  if (theme?.type === 'kyb') {
    const baseTabs = [
      {
        name: 'summary',
        displayName: 'Summary',
        disabled: !tabBlocks['summary']?.length,
      },
      {
        name: 'company_information',
        displayName: 'Company Information',
        disabled: !tabBlocks['company_information']?.length,
      },
      {
        name: 'store_info',
        displayName: 'Store Info',
        disabled: !tabBlocks['store_info']?.length,
      },
      {
        name: 'documents',
        displayName: 'Documents',
        disabled: !tabBlocks['documents']?.length,
      },
      {
        name: 'ubos',
        displayName: 'UBOs',
        disabled: !tabBlocks['ubos']?.length,
      },
      {
        name: 'associated_companies',
        displayName: 'Associated Companies',
        disabled: !tabBlocks['associated_companies']?.length,
      },
      {
        name: 'directors',
        displayName: 'Directors',
        disabled: !tabBlocks['directors']?.length,
      },
      {
        name: 'website_monitoring',
        displayName: 'Monitoring Reports',
        disabled: !tabBlocks['website_monitoring']?.length,
      },
    ];

    return theme.tabsOverride
      ? theme.tabsOverride.map(tabName => baseTabs.find(tab => tab.name === tabName)!)
      : baseTabs;
  }

  return [];
};
