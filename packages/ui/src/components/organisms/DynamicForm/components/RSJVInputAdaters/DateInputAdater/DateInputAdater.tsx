import { DatePickerInput } from '@components/molecules';
import { RJSVInputAdapter } from '@components/organisms/DynamicForm/components/RSJVInputAdaters/types';
import { useCallback } from 'react';

export const DateInputAdater: RJSVInputAdapter = ({ id, formData, disabled, onBlur, onChange }) => {
  const handleBlur = useCallback(() => {
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
