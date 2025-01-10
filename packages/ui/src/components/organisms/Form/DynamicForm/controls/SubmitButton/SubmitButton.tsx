import { Button } from '@/components/atoms';
import { useCallback, useMemo } from 'react';
import { useValidator } from '../../../Validator';
import { useDynamicForm } from '../../context';
import { useStack } from '../../fields/FieldList/providers/StackProvider';
import { useControl } from '../../hooks/external/useControl/useControl';
import { useElement } from '../../hooks/external/useElement';
import { useEvents } from '../../hooks/internal/useEvents';
import { useTaskRunner } from '../../providers/TaskRunner/hooks/useTaskRunner';
import { TDynamicFormElement } from '../../types';

export interface ISubmitButtonParams {
  disableWhenFormIsInvalid?: boolean;
  text?: string;
}

export const SubmitButton: TDynamicFormElement<string, ISubmitButtonParams> = ({ element }) => {
  const { id } = useElement(element);
  const { stack } = useStack();
  const { disabled: _disabled, onClick } = useControl(element, stack);
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
    onClick();

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
  }, [submit, isValid, touchAllFields, runTasks, sendEvent, errors, onClick]);

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
