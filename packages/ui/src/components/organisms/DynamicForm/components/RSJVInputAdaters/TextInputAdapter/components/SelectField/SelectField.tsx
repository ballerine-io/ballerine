import { AnyObject } from '@common/types';
import { DropdownInput, DropdownOption } from '@components/molecules';
import { FieldProps } from '@rjsf/utils';
import { useMemo } from 'react';

export const SelectField = ({
  id,
  onChange,
  schema,
  formData,
  uiSchema,
  disabled,
}: FieldProps<string>) => {
  const options = useMemo((): DropdownOption[] => {
    if (!Array.isArray(schema.oneOf)) return [];

    return (schema.oneOf as AnyObject[]).map(item => {
      return {
        label: item.title as string,
        value: item.const as string,
      };
    }) as DropdownOption[];
  }, [schema.oneOf]);

  return (
    <DropdownInput
      placeholdersParams={{ placeholder: uiSchema['ui:placeholder'] }}
      searchable
      name={id}
      options={options}
      value={formData}
      disabled={disabled}
      onChange={onChange}
    />
  );
};
