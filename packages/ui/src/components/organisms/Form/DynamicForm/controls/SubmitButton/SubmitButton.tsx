import { Button } from '@/components/atoms';
import { useCallback, useMemo } from 'react';
import { useValidator } from '../../../Validator';
import { useDynamicForm } from '../../context';
import { useElement } from '../../hooks/external/useElement';
import { useField } from '../../hooks/external/useField';
import { useEvents } from '../../hooks/internal/useEvents';
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
  const { runTasks, isRunning } = useTaskRunner();
  const { sendEvent } = useEvents(element);

  const { touchAllFields } = fieldHelpers;

  const { isValid, errors } = useValidator();

  const { disableWhenFormIsInvalid = false, text = 'Submit' } = element.params || {};

  const disabled = useMemo(() => {
    if (disableWhenFormIsInvalid && !isValid) return true;

    return _disabled;
  }, [disableWhenFormIsInvalid, isValid, _disabled]);

  const handleSubmit = useCallback(async () => {
    touchAllFields();

    if (!isValid) {
      console.log(`Submit button clicked but form is invalid`);
      console.log('Validation errors', errors);

      return;
    }

    console.log('Starting tasks');
    await runTasks();
    console.log('Tasks finished');

    submit();

    sendEvent('onSubmit');
  }, [submit, isValid, touchAllFields, runTasks, sendEvent, errors]);

  return (
    <Button
      data-testid={`${id}-submit-button`}
      variant="default"
      disabled={disabled || isRunning}
      onClick={handleSubmit}
      className="bg-[#1f2937] hover:bg-[#1f2937]/90 text-[#f8fafc]"
    >
      {text}
    </Button>
  );
};
