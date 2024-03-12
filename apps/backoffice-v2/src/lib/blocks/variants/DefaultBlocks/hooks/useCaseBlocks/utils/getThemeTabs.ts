import { WorkflowDefinitionConfigTheme } from '@/domains/workflow-definitions/fetchers';

export const getThemeTabs = (theme: WorkflowDefinitionConfigTheme) => {
  if (theme?.type === 'kyb') {
    const baseTabs = [
      {
        name: 'summary',
        displayName: 'Summary',
      },
      {
        name: 'company_information',
        displayName: 'Full Company Information',
      },
      {
        name: 'store_info',
        displayName: 'Store Info',
      },
      {
        name: 'documents',
        displayName: 'Documents',
      },
      {
        name: 'individuals',
        displayName: 'Individuals',
      },
    ];

    return theme.tabsOverride
      ? theme.tabsOverride.map(tabName => baseTabs.find(tab => tab.name === tabName)!)
      : baseTabs;
  }

  return [];
};
