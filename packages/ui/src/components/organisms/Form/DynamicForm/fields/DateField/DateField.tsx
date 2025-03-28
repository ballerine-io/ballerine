import { checkIfDateIsValid } from '@/common/utils/check-if-date-is-valid';
import {
  DatePickerChangeEvent,
  DatePickerInput,
  DatePickerValue,
} from '@/components/molecules/inputs/DatePickerInput/DatePickerInput';
import { createTestId } from '@/components/organisms/Renderer';
import { useCallback } from 'react';
import { useField } from '../../hooks/external/useField';
import { useMountEvent } from '../../hooks/internal/useMountEvent';
import { useUnmountEvent } from '../../hooks/internal/useUnmountEvent';
import { FieldDescription } from '../../layouts/FieldDescription';
import { FieldErrors } from '../../layouts/FieldErrors';
import { FieldLayout } from '../../layouts/FieldLayout';
import { FieldPriorityReason } from '../../layouts/FieldPriorityReason';
import { TDynamicFormField } from '../../types';
import { useStack } from '../FieldList/providers/StackProvider';

export interface IDateFieldParams {
  disableFuture?: boolean;
  disablePast?: boolean;
  // Reference for formats https://day.js.org/docs/en/display/format
  outputFormat?: string;
  // Reference for formats https://day.js.org/docs/en/parse/string-format
  inputFormat?: string;
}

export const DateField: TDynamicFormField<IDateFieldParams> = ({ element }) => {
  useMountEvent(element);
  useUnmountEvent(element);

  const {
    disableFuture = false,
    disablePast = false,
    outputFormat = undefined,
    inputFormat = undefined,
  } = element.params || {};

  const { stack } = useStack();
  const { value, onChange, onBlur, onFocus, disabled } = useField<DatePickerValue | undefined>(
    element,
    stack,
  );

  const handleChange = useCallback(
    (event: DatePickerChangeEvent) => {
      const dateValue = event.target.value;

      if (dateValue === null || dateValue === '') {
        return onChange(null);
      }

      if (!checkIfDateIsValid(dateValue)) {
        return;
      }

      onChange(dateValue);
    },
    [onChange],
  );

  return (
    <FieldLayout element={element}>
      <DatePickerInput
        value={value}
        params={{
          disableFuture,
          disablePast,
          outputValueFormat: outputFormat,
          inputDateFormat: inputFormat,
        }}
        disabled={disabled}
        testId={createTestId(element, stack)}
        onBlur={onBlur}
        onChange={handleChange}
        onFocus={onFocus}
      />
      <FieldDescription element={element} />
      <FieldPriorityReason element={element} />
      <FieldErrors element={element} />
    </FieldLayout>
  );
};
