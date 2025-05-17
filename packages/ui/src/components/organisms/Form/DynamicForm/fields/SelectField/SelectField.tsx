import { createTestId } from '@/components/organisms/Renderer';
import { useCallback } from 'react';
import { useField } from '../../hooks/external';
import { useMountEvent } from '../../hooks/internal/useMountEvent';
import { useUnmountEvent } from '../../hooks/internal/useUnmountEvent';
import { FieldDescription } from '../../layouts/FieldDescription';
import { FieldErrors } from '../../layouts/FieldErrors';
import { FieldLayout } from '../../layouts/FieldLayout';
import { FieldPriorityReason } from '../../layouts/FieldPriorityReason';
import { TDynamicFormField } from '../../types';
import { useStack } from '../FieldList/providers/StackProvider';
import { SearchableDropdown } from '@/components/atoms/SearchableDropdown';

export interface ISelectOption {
  value: string;
  label: string;
}

export interface ISelectFieldParams {
  placeholder?: string;
  options: ISelectOption[];
  optionNotFoundText?: string;
}

export const SelectField: TDynamicFormField<ISelectFieldParams> = ({ element }) => {
  useMountEvent(element);
  useUnmountEvent(element);

  const { stack } = useStack();
  const { value, disabled, onChange, onBlur, onFocus } = useField<string | undefined>(
    element,
    stack,
  );

  const {
    placeholder,
    options = [],
    optionNotFoundText = 'No options found',
  } = element.params || {};

  const handleChange = useCallback(
    (value: string) => {
      onChange(value);
    },
    [onChange],
  );

  return (
    <FieldLayout element={element}>
      <SearchableDropdown
        options={options}
        value={value}
        testId={createTestId(element, stack)}
        placeholder={placeholder}
        optionNotFoundText={optionNotFoundText}
        onChange={handleChange}
        onBlur={onBlur}
        onFocus={onFocus}
      />
      <FieldDescription element={element} />
      <FieldPriorityReason element={element} />
      <FieldErrors element={element} />
    </FieldLayout>
  );
};
