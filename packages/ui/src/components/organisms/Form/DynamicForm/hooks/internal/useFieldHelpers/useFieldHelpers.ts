import get from 'lodash/get';
import { useCallback, useMemo } from 'react';
import { useTouched } from '../useTouched';
import { useValues } from '../useValues';

export interface IUseFieldHelpersParams {
  valuesApi: ReturnType<typeof useValues>;
  touchedApi: ReturnType<typeof useTouched>;
}

export const useFieldHelpers = ({ valuesApi, touchedApi }: IUseFieldHelpersParams) => {
  const { values, setFieldValue } = valuesApi;
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
      touchAllFields: touchAllFields,
    }),
    [getTouched, getValue, setFieldTouched, setFieldValue, touchAllFields],
  );

  return helpers;
};
