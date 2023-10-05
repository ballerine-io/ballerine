import { Input, TextArea } from '@components/atoms';
import { FieldProps } from '@rjsf/utils';
import { useCallback } from 'react';

export const TextField = ({
  id,
  name,
  uiSchema,
  formData,
  disabled,
  schema,
  onChange,
}: FieldProps<string | number>) => {
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const serializedValue =
        schema.type === 'integer' || schema.type === 'number'
          ? event.target.value
            ? Number(event.target.value)
            : undefined
          : event.target.value;

      onChange(serializedValue);
    },
    [onChange, schema],
  );

  const inputProps = {
    id,
    name,
    value: formData || '',
    placeholder: uiSchema['ui:placeholder'],
    disabled,
    onChange: handleChange,
  };

  return uiSchema['ui:widget'] === 'textarea' ? (
    <TextArea {...inputProps} />
  ) : (
    <Input {...inputProps} type={schema.type === 'number' ? 'number' : 'text'} />
  );
};
