import { TextArea } from '@/components/atoms';
import { Input } from '@/components/atoms/Input';
import { createTestId } from '@/components/organisms/Renderer';
import { useCallback } from 'react';
import { useField } from '../../hooks/external';
import { FieldErrors } from '../../layouts/FieldErrors';
import { FieldLayout } from '../../layouts/FieldLayout';
import { TBaseFormElements, TDynamicFormField } from '../../types';
import { useStack } from '../FieldList/providers/StackProvider';
import { serializeTextFieldValue } from './helpers';

export interface ITextFieldParams {
  valueType: 'integer' | 'number' | 'string';
  style: 'text' | 'textarea';
  placeholder?: string;
}

export const TextField: TDynamicFormField<TBaseFormElements, ITextFieldParams> = ({ element }) => {
  const { params } = element;
  const { valueType = 'string', style = 'text', placeholder } = params || {};

  const { stack } = useStack();

  const { value, onChange, onBlur, disabled } = useField(element, stack);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const serializedValue = serializeTextFieldValue(event.target.value, valueType);

      onChange(serializedValue);
    },
    [onChange, valueType],
  );

  const inputProps = {
    value: value || '',
    placeholder,
    disabled,
    onChange: handleChange,
    onBlur,
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
      <FieldErrors definition={element} />
    </FieldLayout>
  );
};
