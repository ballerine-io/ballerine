import { FieldErrors } from '@/pages/CollectionFlowV2/components/ui/field-parts/FieldErrors';
import { FieldLayout } from '@/pages/CollectionFlowV2/components/ui/field-parts/FieldLayout';
import { serializeTextFieldValue } from '@/pages/CollectionFlowV2/components/ui/fields/TextField/helpers';
import { IFieldComponentProps } from '@/pages/CollectionFlowV2/types';
import { createTestId, Input, TextArea } from '@ballerine/ui';
import { FunctionComponent, useCallback, useMemo } from 'react';

export type TTextFieldValueType = string | number | undefined;
export type TTextFieldOptions = {
  valueType: 'integer' | 'number' | 'string';
  style: 'text' | 'textarea';
  placeholder?: string;
};

export const TextField: FunctionComponent<
  IFieldComponentProps<TTextFieldValueType, TTextFieldOptions>
> = ({ options = {} as TTextFieldOptions, definition, stack, fieldProps }) => {
  const { valueType = 'string', style = 'text', placeholder } = options;
  const { onChange, onBlur, value, disabled } = fieldProps;
  const testId = useMemo(() => createTestId(definition, stack), [definition, stack]);

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
    <FieldLayout definition={definition} stack={stack}>
      {style === 'textarea' ? (
        <TextArea {...inputProps} data-testid={testId} />
      ) : (
        <Input
          {...inputProps}
          type={valueType !== 'string' ? 'number' : 'text'}
          data-testid={testId}
        />
      )}
      <FieldErrors definition={definition} />
    </FieldLayout>
  );
};
