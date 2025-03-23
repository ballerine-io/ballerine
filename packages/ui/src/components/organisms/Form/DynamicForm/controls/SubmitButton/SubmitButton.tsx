import { Button } from '@/components/atoms';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
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

  const isShouldRenderLoader = useMemo(() => {
    return disabled || isRunning;
  }, [disabled, isRunning]);

  return (
    <Button
      data-testid={`${id}-submit-button`}
      variant="default"
      disabled={!isValid && disableWhenFormIsInvalid}
      onClick={isShouldRenderLoader ? undefined : handleSubmit}
      className="bg-[#1f2937] text-[#f8fafc] transition-all duration-300 hover:bg-[#1f2937]/90"
    >
      <motion.div
        className="flex min-w-[24px] items-center justify-center"
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {isShouldRenderLoader ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="flex items-center justify-center"
          >
            <Loader2 className="h-4 w-4 animate-spin" />
          </motion.div>
        ) : (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            {text}
          </motion.span>
        )}
      </motion.div>
    </Button>
  );
};
