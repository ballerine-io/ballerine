import { useUIElement } from '@/pages/CollectionFlowV2/hooks/useUIElement';
import set from 'lodash/set';
import { useCallback, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { IFormElement } from '../../../../types';

export interface IUseFieldListProps {
  element: IFormElement;
}

export const useFieldList = ({}) => {
  const uiElement = useUIElement(definition, payload, stack);

  const items = useMemo(() => (uiElement.getValue() as Array<{ _id: string }>) || [], [uiElement]);

  const addItem = useCallback(() => {
    const valueDestination = uiElement.getValueDestination();

    const newValue = [...items, { _id: uuidv4(), ...options?.defaultValue }];
    set(payload, valueDestination, newValue);

    stateApi.setContext(payload);
  }, [uiElement, items, stateApi]);

  const removeItem = useCallback(
    (index: number) => {
      if (!Array.isArray(items)) return;

      const newValue = items.filter((_, i) => i !== index);
      set(payload, uiElement.getValueDestination(), newValue);

      stateApi.setContext(payload);
    },
    [uiElement, items, stateApi],
  );

  return {
    items,
    addItem,
    removeItem,
  };
};
