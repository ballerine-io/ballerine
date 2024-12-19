import { Button } from '@/components/atoms';
import { useCallback, useMemo } from 'react';
import { useValidator } from '../../../Validator';
import { useDynamicForm } from '../../context';
import { useElement } from '../../hooks/external/useElement';
import { useField } from '../../hooks/external/useField';
import { useTaskRunner } from '../../providers/TaskRunner/hooks/useTaskRunner';
import { TDynamicFormElement } from '../../types';

export interface ISubmitButtonParams {
  disableWhenFormIsInvalid?: boolean;
  text?: string;
}

export const SubmitButton: TDynamicFormElement<string, ISubmitButtonParams> = ({ element }) => {
  const { id } = useElement(element);
  const { disabled: _disabled } = useField(element);
  const { fieldHelpers, submit } = useDynamicForm();
  const { runTasks } = useTaskRunner();

  const { touchAllFields } = fieldHelpers;

  const { isValid } = useValidator();

  const { disableWhenFormIsInvalid = false, text = 'Submit' } = element.params || {};

  const disabled = useMemo(() => {
    if (disableWhenFormIsInvalid && !isValid) return true;

    return _disabled;
  }, [disableWhenFormIsInvalid, isValid, _disabled]);

  const handleSubmit = useCallback(async () => {
    touchAllFields();

    if (!isValid) return;

    console.log('Starting tasks');
    await runTasks();
    console.log('Tasks finished');

    submit();
  }, [submit, isValid, touchAllFields, runTasks]);

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
