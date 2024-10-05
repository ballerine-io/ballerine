import { UIElement } from '@/components/providers/Validator/hooks/useValidate/ui-element';
import { useMemo } from 'react';

export const useDocuments = (uiElement: UIElement) => {
  const documents = useMemo(() => {
    return uiElement.getValue() || [];
  }, [uiElement]);

  return documents;
};
