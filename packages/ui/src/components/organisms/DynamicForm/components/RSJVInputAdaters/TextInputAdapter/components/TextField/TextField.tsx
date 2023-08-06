import { Input, TextArea } from '@components/atoms';
import { FieldProps } from '@rjsf/utils';
import { useCallback } from 'react';

export const TextField = ({
  id,
  name,
  uiSchema,
  formData,
  disabled,
  onChange,
}: FieldProps<string>) => {
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      onChange(event.target.value);
    },
    [onChange],
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
    <Input {...inputProps} />
  );
};
