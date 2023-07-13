import { FieldProps } from '@rjsf/utils';
import { Input } from '@ballerine/ui';

export const TextInput = ({ id, name, value, uiSchema, onChange }: FieldProps) => {
  return (
    <Input
      id={id}
      name={name}
      value={value}
      placeholder={uiSchema['ui:placeholder']}
      onChange={onChange}
    />
  );
};
