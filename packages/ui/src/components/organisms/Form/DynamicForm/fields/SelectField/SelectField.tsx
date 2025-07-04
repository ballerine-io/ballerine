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
import { GetUIElementByType } from '@ballerine/common';

export const SelectField: TDynamicFormField<GetUIElementByType<'selectfield'>> = ({ element }) => {
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
        disabled={disabled}
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
