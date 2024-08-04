import { IUIDefinition, IUISchema } from '@/domains/ui-definitions';
import { useUpdateUIDefinitionMutation } from '@/pages/WorkflowDefinition/hooks/useUpdateUIDefinitionMutation';
import { useCallback, useState } from 'react';

export const useUIDefinitionElementUpdate = (
  workflowDefinitionId: string,
  uiDefinition: IUIDefinition,
) => {
  const [uiDefinitionValue, setUIDefinitionValue] = useState<IUIDefinition>(uiDefinition);
  const { mutate } = useUpdateUIDefinitionMutation();

  const handleElementChange = useCallback((value: IUISchema['elements'][number]) => {
    const updatedElements = uiDefinition.uiSchema.elements.map(element => {
      if (element.stateName === value.stateName) {
        return value;
      }

      return element;
    });

    setUIDefinitionValue({
      ...uiDefinition,
      uiSchema: {
        ...uiDefinition.uiSchema,
        elements: updatedElements,
      },
    });
  }, []);

  const handleUIDefinitionChange = useCallback((value: IUIDefinition) => {
    setUIDefinitionValue(value);
  }, []);

  const handleSave = useCallback(() => {
    mutate({
      workflowDefinitionId,
      uiDefinitionId: uiDefinition.id,
      uiDefinition: uiDefinitionValue,
    });
  }, [uiDefinitionValue]);

  const reset = useCallback(() => {
    setUIDefinitionValue(uiDefinition);
  }, [uiDefinition]);

  return {
    uiDefinitionValue,
    handleUIDefinitionChange,
    handleElementChange,
    handleSave,
    reset,
  };
};
