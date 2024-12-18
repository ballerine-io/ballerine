import { useCallback } from 'react';
import { useField } from '../../../../hooks/external';
import { IFormElement } from '../../../../types';
import { useStack } from '../../providers/StackProvider';

export interface IUseFieldParams<T> {
  defaultValue: T;
}
export interface IUseFieldListProps {
  element: IFormElement<string, IUseFieldParams<object>>;
}

export const useFieldList = ({ element }: IUseFieldListProps) => {
  const { stack } = useStack();
  const { onChange, value = [] } = useField<unknown[]>(element, stack);

  const addItem = useCallback(() => {
    onChange([...value, element.params?.defaultValue]);
  }, [value, element.params?.defaultValue, onChange]);

  const removeItem = useCallback(
    (index: number) => {
      if (!Array.isArray(value)) return;

      const newValue = value.filter((_, i) => i !== index);
      console.log('newValue', newValue);
      onChange(newValue);
    },
    [value, onChange],
  );

  return {
    items: value,
    addItem,
    removeItem,
  };
};
