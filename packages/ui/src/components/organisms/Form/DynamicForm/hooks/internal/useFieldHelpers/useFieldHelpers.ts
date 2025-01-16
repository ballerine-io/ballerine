import get from 'lodash/get';
import { useCallback, useMemo } from 'react';
import { useTouched } from '../useTouched';
import { useValues } from '../useValues';

export interface IUseFieldHelpersParams<TValues extends object> {
  valuesApi: ReturnType<typeof useValues<TValues>>;
  touchedApi: ReturnType<typeof useTouched>;
}

export const useFieldHelpers = <TValues extends object>({
  valuesApi,
  touchedApi,
}: IUseFieldHelpersParams<TValues>) => {
  const { values, setFieldValue, setValues } = valuesApi;
  const { touched, setFieldTouched, touchAllFields } = touchedApi;

  const getTouched = useCallback(
    (fieldId: string) => {
      return Boolean(touched[fieldId]);
    },
    [touched],
  );

  const getValue = useCallback(
    <T>(valueDestination: string) => {
      return get(values, valueDestination) as T;
    },
    [values],
  );

  const helpers = useMemo(
    () => ({
      getTouched,
      getValue,
      setTouched: setFieldTouched,
      setValue: setFieldValue,
      setValues: setValues,
      touchAllFields: touchAllFields,
    }),
    [getTouched, getValue, setFieldTouched, setFieldValue, setValues, touchAllFields],
  );

  return helpers;
};
