// import { Input } from '@ballerine/ui/components/atoms/Input';
import { Label } from '@ballerine/ui';
import { Input } from '@ballerine/ui/lib/components/atoms/Input';
import { FieldProps } from '@rjsf/utils';

export const FileInput = ({
  id,
  name,
  uiSchema,
  schema,
  rawErrors,
  onChange,
  ...rest
}: FieldProps) => {
  console.log('rawErrors', rest);
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{schema.title}</Label>
      <Input
        type="file"
        id={id}
        name={name}
        placeholder={uiSchema['ui:placeholder']}
        onChange={event => {
          onChange(event.target.files[0].name) as void;
        }}
      />
    </div>
  );
};
