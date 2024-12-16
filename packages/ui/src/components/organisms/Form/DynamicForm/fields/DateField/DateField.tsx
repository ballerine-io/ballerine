import { checkIfDateIsValid } from '@/common/utils/check-if-date-is-valid';
import {
  DatePickerChangeEvent,
  DatePickerInput,
  DatePickerValue,
} from '@/components/molecules/inputs/DatePickerInput/DatePickerInput';
import { createTestId } from '@/components/organisms/Renderer';
import { useCallback } from 'react';
import { useField } from '../../hooks/external/useField';
import { FieldLayout } from '../../layouts/FieldLayout';
import { TBaseFormElements, TDynamicFormField } from '../../types';
import { useStack } from '../FieldList/providers/StackProvider';

export interface IDateFieldParams {
  disableFuture?: boolean;
  disablePast?: boolean;
  outputFormat?: 'date' | 'iso';
}

export const DateField: TDynamicFormField<TBaseFormElements, IDateFieldParams> = ({ element }) => {
  const {
    disableFuture = false,
    disablePast = false,
    outputFormat = undefined,
  } = element.params || {};

  const { stack } = useStack();
  const { value, onChange, onBlur, disabled } = useField<DatePickerValue | undefined>(
    element,
    stack,
  );

  const handleChange = useCallback(
    (event: DatePickerChangeEvent) => {
      const dateValue = event.target.value;

      if (dateValue === null) return onChange(null);

      if (!checkIfDateIsValid(dateValue)) return;

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
        }}
        disabled={disabled}
        testId={createTestId(element, stack)}
        onBlur={onBlur}
        onChange={handleChange}
      />
    </FieldLayout>
  );
};
