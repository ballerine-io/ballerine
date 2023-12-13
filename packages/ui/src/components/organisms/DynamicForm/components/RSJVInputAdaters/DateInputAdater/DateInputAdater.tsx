import { DatePickerChangeEvent, DatePickerInput, DatePickerParams } from '@/components/molecules';
import { RJSFInputAdapter } from '@/components/organisms/DynamicForm/components/RSJVInputAdaters/types';
import { useCallback, useMemo } from 'react';

export const isValidDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  if (date.getFullYear() < 1000) return false;

  return true;
};

export const DateInputAdater: RJSFInputAdapter<string | null> = ({
  id,
  formData,
  disabled,
  uiSchema,
  onBlur,
  onChange,
}) => {
  const handleBlur = useCallback(() => {
    // @ts-ignore
    onBlur && onBlur(id, formData);
  }, [id, onBlur, formData]);

  const handleChange = useCallback(
    (event: DatePickerChangeEvent) => {
      const dateValue = event.target.value;
      if (dateValue === null) return onChange(null);

      // every onChange call in context of DateInput forces re-render of component which eventually dicsonnects user focus from input
      // in cases when date considered as valid e.g 05/12/0100 but doesnt make sense onChange call should be skipped
      // validating date with helper below
      if (!isValidDate(dateValue)) return;

      onChange(dateValue);
    },
    [onChange],
  );

  const datePickerParams = useMemo(() => {
    const params: DatePickerParams = {
      disableFuture: uiSchema?.disableFutureDate,
      disablePast: uiSchema?.disablePastDate,
    };

    return params;
  }, [uiSchema?.disableFutureDate, uiSchema?.disablePastDate]);

  return (
    <DatePickerInput
      value={formData ? formData : undefined}
      params={datePickerParams}
      onChange={handleChange}
      disabled={disabled}
      onBlur={handleBlur}
    />
  );
};
