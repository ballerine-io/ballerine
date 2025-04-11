import { isObject } from '@ballerine/common';
import get from 'lodash/get';
import set from 'lodash/set';
import { useCallback, useEffect, useRef, useState } from 'react';
import { IFormElement } from '../../../types';
import { insertDefaultValues } from './helpers/insert-default-values';

export interface IUseValuesProps<TValues extends object> {
  values: TValues;
  schema?: Array<IFormElement<string, any>>;
  onChange?: (newValues: TValues) => void;
  onFieldChange?: (fieldName: string, newValue: unknown, newValues: TValues) => void;
}

export const useValues = <TValues extends object>({
  values: initialValues,
  schema,
  onChange,
  onFieldChange,
}: IUseValuesProps<TValues>) => {
  const [values, setValuesState] = useState<TValues>(() =>
    insertDefaultValues(initialValues, schema),
  );

  const valuesRef = useRef<TValues>(values);

  useEffect(() => {
    valuesRef.current = initialValues;
  }, [initialValues]);

  useEffect(() => {
    setValuesState(insertDefaultValues(valuesRef.current, schema));
  }, [schema, valuesRef]);

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

          if (isObject(parentValue)) {
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
