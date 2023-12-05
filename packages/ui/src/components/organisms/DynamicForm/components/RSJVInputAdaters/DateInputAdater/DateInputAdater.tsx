import { DatePickerChangeEvent, DatePickerInput } from '@/components/molecules';
import { RJSFInputAdapter } from '@/components/organisms/DynamicForm/components/RSJVInputAdaters/types';
import { useCallback } from 'react';

export const isDateValid = (dateString: string): boolean => {
  const date = new Date(dateString);
  if (date.getFullYear() < 1000) return false;

  return true;
};

export const DateInputAdater: RJSFInputAdapter<string | null> = ({
  id,
  formData,
  disabled,
  onBlur,
  onChange,
}) => {
  const handleBlur = useCallback(() => {
    // @ts-ignore
    onBlur && onBlur(id, formData);
  }, [id, onBlur, formData]);

  const handleChange = useCallback(
    (event: DatePickerChangeEvent) => {
      const dateValue: string | null = event.target.value;
      if (dateValue === null) return onChange(null);

      const dateString = String(event.target.value);

      // every onChange call in context of DateInput forces re-render of component which eventually dicsonnects user focus from input
      // in cases when date considered as valid e.g 05/12/0100 but doesnt make sense onChange call should be skipped
      // validating date with helper below
      if (!isDateValid(dateString)) return;

      onChange(dateString);
    },
    [onChange],
  );

  return (
    <DatePickerInput
      value={formData ? formData : undefined}
      onChange={handleChange}
      disabled={disabled}
      onBlur={handleBlur}
    />
  );
};
