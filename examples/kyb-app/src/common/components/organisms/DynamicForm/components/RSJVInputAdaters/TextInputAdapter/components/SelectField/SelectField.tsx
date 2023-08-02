import { AnyObject, DropdownOption, DropdownInput } from '@ballerine/ui';
import { FieldProps } from '@rjsf/utils';
import { useMemo } from 'react';

export const SelectField = ({ id, onChange, schema, formData, uiSchema }: FieldProps<string>) => {
  const options = useMemo((): DropdownOption[] => {
    if (!Array.isArray(schema.oneOf)) return [];

    return (schema.oneOf as AnyObject[]).map(item => {
      return {
        label: item.const as string,
        value: item.title as string,
      };
    }) as DropdownOption[];
  }, [schema.oneOf]);

  return (
    <DropdownInput
      placeholder={uiSchema['ui:placeholder']}
      name={id}
      options={options}
      value={formData}
      onChange={onChange}
    />
  );
};
