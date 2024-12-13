import { TDeepthLevelStack } from '@/components/organisms/Form/Validator';
import { useCallback, useMemo } from 'react';
import { useDynamicForm } from '../../../context';
import { IFormElement } from '../../../types';
import { useElementId } from '../useElementId';
import { useValueDestination } from '../useValueDestination';

export const useField = <TValue>(element: IFormElement, stack: TDeepthLevelStack = []) => {
  const fieldId = useElementId(element, stack);
  const valueDestination = useValueDestination(element, stack);
  const { fieldHelpers } = useDynamicForm();

  const { setValue, getValue, setTouched, getTouched } = fieldHelpers;

  const value = useMemo(() => getValue<TValue>(valueDestination), [valueDestination, getValue]);
  const touched = useMemo(() => getTouched(fieldId), [fieldId, getTouched]);

  const onChange = useCallback(
    <TValue>(value: TValue) => {
      setValue(fieldId, valueDestination, value);
      setTouched(fieldId, true);

      // TODO: Dispatch onChange event?
    },
    [fieldId, valueDestination, setValue, setTouched],
  );

  const onBlur = useCallback(() => {
    // TODO: Dispatch onBlur event?
  }, []);

  return {
    value,
    touched,
    onChange,
    onBlur,
  };
};
