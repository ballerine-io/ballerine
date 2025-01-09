import { TextArea } from '@/components/atoms';
import { Input } from '@/components/atoms/Input';
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
import { serializeTextFieldValue } from './helpers';

export interface ITextFieldParams {
  valueType: 'integer' | 'number' | 'string';
  style: 'text' | 'textarea';
  placeholder?: string;
}

export const TextField: TDynamicFormField<ITextFieldParams> = ({ element }) => {
  useMountEvent(element);
  useUnmountEvent(element);

  const { params } = element;
  const { valueType = 'string', style = 'text', placeholder } = params || {};

  const { stack } = useStack();

  const { id } = useElement(element, stack);
  const { value, onChange, onBlur, onFocus, disabled } = useField(element, stack);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const serializedValue = serializeTextFieldValue(event.target.value, valueType);

      onChange(serializedValue);
    },
    [onChange, valueType],
  );

  const inputProps = {
    id,
    value: value || '',
    placeholder,
    disabled,
    onChange: handleChange,
    onBlur,
    onFocus,
  };

  return (
    <FieldLayout element={element}>
      {style === 'textarea' ? (
        <TextArea
          {...inputProps}
          value={value?.toString() || ''}
          data-testid={createTestId(element, stack)}
        />
      ) : (
        <Input
          {...inputProps}
          type={valueType !== 'string' ? 'number' : 'text'}
          data-testid={createTestId(element, stack)}
          value={value?.toString() || ''} // Ensure value is string or number
        />
      )}
      <FieldDescription element={element} />
      <FieldPriorityReason element={element} />
      <FieldErrors element={element} />
    </FieldLayout>
  );
};
