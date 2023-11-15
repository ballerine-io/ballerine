import { DatePickerInput } from '@/components/molecules';
import { RJSFInputAdapter } from '@/components/organisms/DynamicForm/components/RSJVInputAdaters/types';
import { useCallback } from 'react';

export const DateInputAdater: RJSFInputAdapter = ({ id, formData, disabled, onBlur, onChange }) => {
  const handleBlur = useCallback(() => {
    // @ts-ignore
    onBlur && onBlur(id, formData);
  }, [id, onBlur, formData]);

  return (
    <DatePickerInput
      value={formData ? formData : undefined}
      onChange={event => void onChange(String(event.target.value))}
      disabled={disabled}
      onBlur={handleBlur}
    />
  );
};
