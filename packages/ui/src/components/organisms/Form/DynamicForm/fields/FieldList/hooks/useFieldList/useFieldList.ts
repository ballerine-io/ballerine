import jsonata from 'jsonata';
import { useCallback } from 'react';
import { useDynamicForm } from '../../../../context';
import { useField } from '../../../../hooks/external';
import { IFormElement } from '../../../../types';
import { useStack } from '../../providers/StackProvider';

export interface IUseFieldParams {
  // jsonata expression
  defaultValue?: string;
}
export interface IUseFieldListProps {
  element: IFormElement<string, IUseFieldParams>;
}

export const useFieldList = ({ element }: IUseFieldListProps) => {
  const { stack } = useStack();
  const { onChange, value = [] } = useField<unknown[]>(element, stack);
  const { values } = useDynamicForm();

  const addItem = useCallback(async () => {
    if (element.params?.defaultValue) {
      const expression = element.params?.defaultValue;
      const result = await jsonata(expression).evaluate(values);
      onChange([...value, result]);
    } else {
      onChange([...value]);
    }
  }, [value, element.params?.defaultValue, onChange, values]);

  const removeItem = useCallback(
    (index: number) => {
      if (!Array.isArray(value)) return;

      const newValue = value.filter((_, i) => i !== index);
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
