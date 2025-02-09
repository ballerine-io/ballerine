import get from 'lodash/get';
import set from 'lodash/set';
import { useCallback, useState } from 'react';

export interface IUseValuesProps<TValues extends object> {
  values: TValues;
  onChange?: (newValues: TValues) => void;
  onFieldChange?: (fieldName: string, newValue: unknown, newValues: TValues) => void;
}

export const useValues = <TValues extends object>({
  values: initialValues,
  onChange,
  onFieldChange,
}: IUseValuesProps<TValues>) => {
  const [values, setValuesState] = useState<TValues>(initialValues);

  const setValues = useCallback(
    (newValues: TValues) => {
      setValuesState(newValues);
      onChange?.(newValues);
    },
    [onChange],
  );

  const setFieldValue = useCallback(
    (fieldName: string, valueDestination: string, newValue: unknown) => {
      setValuesState(prev => {
        const newValues = { ...prev };
        const parentValueDestination = valueDestination.split('.').slice(0, -1).join('.');

        set(newValues, valueDestination, newValue);

        if (parentValueDestination) {
          const parentValue = get(prev, parentValueDestination);
          let newParentValue: any;

          if (Array.isArray(parentValue)) {
            newParentValue = [...parentValue];
          }

          if (typeof parentValue === 'object' && !Array.isArray(parentValue)) {
            newParentValue = { ...parentValue };
          }

          set(newValues, parentValueDestination, newParentValue);
        }

        onFieldChange?.(fieldName, newValue, newValues);
        onChange?.(newValues);

        return newValues;
      });
    },
    [onFieldChange, onChange],
  );

  return { values, setValues, setFieldValue };
};
