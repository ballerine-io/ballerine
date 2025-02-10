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
  const { stack } = useStack();
  const { id } = useElement(element, stack);
  const { disabled: _disabled, onClick } = useControl(element, stack);
  const { fieldHelpers, values, submit } = useDynamicForm();
  const { runTasks, isRunning } = useTaskRunner();
  const { sendEvent } = useEvents(element);
  const { validate, isValid } = useValidator();

  const { touchAllFields } = fieldHelpers;

  const { disableWhenFormIsInvalid = false, text = 'Submit' } = element.params || {};

  const disabled = useMemo(() => {
    if (disableWhenFormIsInvalid && !isValid) {
      return true;
    }

    return _disabled;
  }, [disableWhenFormIsInvalid, isValid, _disabled]);

  const handleSubmit = useCallback(async () => {
    onClick();

    touchAllFields();

    const validationResult = await validate();
    const isValid = validationResult?.length === 0;

    if (!isValid) {
      console.log(`Submit button clicked but form is invalid`);
      console.log('Validation errors', validationResult);

      return;
    }

    console.log('Starting tasks');
    const updatedContext = await runTasks({ ...values });
    console.log('Tasks finished');

    fieldHelpers.setValues(updatedContext);

    submit(updatedContext);
    sendEvent('onSubmit');
  }, [submit, touchAllFields, runTasks, sendEvent, onClick, values, fieldHelpers, validate]);

  return (
    <Button
      data-testid={`${id}-submit-button`}
      variant="default"
      disabled={disabled || isRunning}
      onClick={handleSubmit}
      className="bg-[#1f2937] text-[#f8fafc] hover:bg-[#1f2937]/90"
    >
      {text}
    </Button>
  );
};
