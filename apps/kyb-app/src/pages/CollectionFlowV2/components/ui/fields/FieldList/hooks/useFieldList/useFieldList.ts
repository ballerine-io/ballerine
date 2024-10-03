import { useStateManagerContext } from '@/components/organisms/DynamicUI/StateManager/components/StateProvider';
import {
  IFieldListOptions,
  TFieldListValueType,
} from '@/pages/CollectionFlowV2/components/ui/fields/FieldList/FieldList';
import { useUIElement } from '@/pages/CollectionFlowV2/hooks/useUIElement';
import { IFieldComponentProps } from '@/pages/CollectionFlowV2/types';
import set from 'lodash/set';
import { useCallback, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const useFieldList = ({
  definition,
  stack,
  fieldProps,
  options,
}: IFieldComponentProps<TFieldListValueType<{ _id: string }>, IFieldListOptions>) => {
  const { payload, stateApi } = useStateManagerContext();
  const uiElement = useUIElement(definition, payload, stack);

  const items = useMemo(() => (uiElement.getValue() as { _id: string }[]) || [], [uiElement]);

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
