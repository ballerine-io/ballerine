import { Button } from '@/components/atoms';
import { useCallback, useMemo } from 'react';
import { useValidator } from '../../../Validator';
import { useDynamicForm } from '../../context';
import { useElement } from '../../hooks/external/useElement';
import { useField } from '../../hooks/external/useField';
import { TDynamicFormElement } from '../../types';

export interface ISubmitButtonParams {
  disableWhenFormIsInvalid?: boolean;
  text?: string;
}

export const SubmitButton: TDynamicFormElement<string, ISubmitButtonParams> = ({ element }) => {
  const { id } = useElement(element);
  const { disabled: _disabled } = useField(element);
  const { fieldHelpers, submit } = useDynamicForm();

  const { touchAllFields } = fieldHelpers;

  const { isValid } = useValidator();

  const { disableWhenFormIsInvalid = false, text = 'Submit' } = element.params || {};

  const disabled = useMemo(() => {
    if (disableWhenFormIsInvalid && !isValid) return true;

    return _disabled;
  }, [disableWhenFormIsInvalid, isValid, _disabled]);

  const handleSubmit = useCallback(() => {
    touchAllFields();

    if (!isValid) return;

    submit();
  }, [submit, isValid, touchAllFields]);

  return (
    <Button
      data-testid={`${id}-submit-button`}
      variant="secondary"
      disabled={disabled}
      onClick={handleSubmit}
    >
      {text}
    </Button>
  );
};
