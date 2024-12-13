import { FieldErrors } from '@/pages/CollectionFlowV2/components/ui/field-parts/FieldErrors';
import { FieldLayout } from '@/pages/CollectionFlowV2/components/ui/field-parts/FieldLayout';
import { IFieldComponentProps } from '@/pages/CollectionFlowV2/types';
import {
  createTestId,
  DatePickerChangeEvent,
  DatePickerInput,
  DatePickerValue,
  isValidDate,
} from '@ballerine/ui';
import { FunctionComponent, useCallback } from 'react';

export interface IDateFieldOptions {
  disableFuture?: boolean;
  disablePast?: boolean;
  outputFormat?: 'date' | 'iso';
}

const defaultOptions: IDateFieldOptions = {
  disableFuture: false,
  disablePast: false,
  outputFormat: undefined,
};

export const DateField: FunctionComponent<
  IFieldComponentProps<DatePickerValue, IDateFieldOptions>
> = ({ fieldProps, definition, options = defaultOptions, stack }) => {
  const { onBlur, onChange, value, disabled } = fieldProps;
  const {
    disableFuture = defaultOptions.disableFuture,
    disablePast = defaultOptions.disablePast,
    outputFormat = defaultOptions.outputFormat,
  } = options;

  const handleChange = useCallback(
    (event: DatePickerChangeEvent) => {
      const dateValue = event.target.value;

      if (dateValue === null) return onChange(null);

      if (!isValidDate(dateValue)) return;

      onChange(dateValue);
    },
    [onChange],
  );

  return (
    <FieldLayout definition={definition}>
      <DatePickerInput
        value={value}
        params={{
          disableFuture,
          disablePast,
          outputValueFormat: outputFormat,
        }}
        disabled={disabled}
        testId={createTestId(definition, stack)}
        onBlur={onBlur}
        onChange={handleChange}
      />
      <FieldErrors definition={definition} />
    </FieldLayout>
  );
};
