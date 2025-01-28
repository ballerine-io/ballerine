import { DropdownInput } from '@/components/molecules';
import { createTestId } from '@/components/organisms/Renderer';
import { useCallback } from 'react';
import { useElement, useField } from '../../hooks/external';
import { useMountEvent } from '../../hooks/internal/useMountEvent';
import { useUnmountEvent } from '../../hooks/internal/useUnmountEvent';
import { FieldDescription } from '../../layouts/FieldDescription';
import { FieldErrors } from '../../layouts/FieldErrors';
import { FieldLayout } from '../../layouts/FieldLayout';
import { FieldPriorityReason } from '../../layouts/FieldPriorityReason';
import { TDynamicFormField } from '../../types';
import { useStack } from '../FieldList/providers/StackProvider';

export interface ISelectOption {
  value: string;
  label: string;
}

export interface ISelectFieldParams {
  placeholder?: string;
  options: ISelectOption[];
}

export const SelectField: TDynamicFormField<ISelectFieldParams> = ({ element }) => {
  useMountEvent(element);
  useUnmountEvent(element);

  const { stack } = useStack();
  const { id } = useElement(element, stack);
  const { value, disabled, onChange, onBlur, onFocus } = useField<string | undefined>(
    element,
    stack,
  );

  const { placeholder, options = [] } = element.params || {};

  const handleChange = useCallback(
    (value: string) => {
      onChange(value);
    },
    [onChange],
  );

  return (
    <FieldLayout element={element}>
      <DropdownInput
        name={id}
        options={options}
        value={value}
        testId={createTestId(element, stack)}
        placeholdersParams={{
          placeholder: placeholder || '',
          searchPlaceholder: '',
        }}
        searchable
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
