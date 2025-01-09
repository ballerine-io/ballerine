import { PhoneNumberInput } from '@/components/atoms';
import { createTestId } from '@/components/organisms/Renderer';
import { useCallback } from 'react';
import { useField } from '../../hooks/external';
import { useMountEvent } from '../../hooks/internal/useMountEvent';
import { useUnmountEvent } from '../../hooks/internal/useUnmountEvent';
import { FieldDescription } from '../../layouts/FieldDescription';
import { FieldErrors } from '../../layouts/FieldErrors';
import { FieldLayout } from '../../layouts/FieldLayout';
import { FieldPriorityReason } from '../../layouts/FieldPriorityReason';
import { TDynamicFormElement } from '../../types';
import { useStack } from '../FieldList/providers/StackProvider';

export interface IPhoneFieldParams {
  defaultCountry?: string;
}

export const PhoneField: TDynamicFormElement<string, IPhoneFieldParams> = ({ element }) => {
  useMountEvent(element);
  useUnmountEvent(element);

  const { defaultCountry = 'us' } = element.params || {};
  const { stack } = useStack();
  const { value, disabled, onChange, onBlur, onFocus } = useField<string | undefined>(
    element,
    stack,
  );

  const handleChange = useCallback(
    (value: string) => {
      onChange(value);
    },
    [onChange],
  );

  return (
    <FieldLayout element={element}>
      <PhoneNumberInput
        country={defaultCountry}
        testId={createTestId(element, stack)}
        value={value}
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
