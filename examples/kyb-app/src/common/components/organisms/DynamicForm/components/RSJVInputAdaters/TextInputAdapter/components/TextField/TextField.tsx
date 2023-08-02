import { Input } from '@ballerine/ui';
import { FieldProps } from '@rjsf/utils';

export const TextField = ({
  id,
  name,
  uiSchema,
  formData,
  onChange,
  ...rest
}: FieldProps<string>) => {
  console.log('text field', uiSchema);
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
