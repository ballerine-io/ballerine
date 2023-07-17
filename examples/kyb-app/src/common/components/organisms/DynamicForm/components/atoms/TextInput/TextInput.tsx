import { Input } from '@ballerine/ui';
import { FieldProps } from '@rjsf/utils';

export const TextInput = ({ id, name, uiSchema, formData, onChange }: FieldProps<string>) => {
  return (
    <Input
      id={id}
      name={name}
      value={formData ? formData : ''}
      placeholder={uiSchema['ui:placeholder']}
      onChange={event => onChange(event.target.value) as void}
    />
  );
};
