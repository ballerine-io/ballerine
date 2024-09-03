import { IUISchema } from '@/domains/ui-definitions';
import { useCallback, useState } from 'react';

export const useUIDefinitionEditorTabs = (uiElements: IUISchema['elements']) => {
  const [tabValue, setTabValue] = useState<string | undefined>();

  const handleTabChange = useCallback((tabValue: string) => {
    setTabValue(tabValue);
  }, []);

  return {
    tabValue,
    handleTabChange,
  };
};
