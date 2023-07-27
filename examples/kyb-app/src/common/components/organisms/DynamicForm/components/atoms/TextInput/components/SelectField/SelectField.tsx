import { SelectInput } from '@app/common/components/atoms/SelectInput';
import { SelectInputOption } from '@app/common/components/atoms/SelectInput/types';
import { AnyObject } from '@ballerine/ui';
import { FieldProps } from '@rjsf/utils';
import { useMemo } from 'react';

export const SelectField = ({ id, onChange, value, schema, formData }: FieldProps<string>) => {
  const options = useMemo((): SelectInputOption[] => {
    if (!Array.isArray(schema.oneOf)) return [];

    return (schema.oneOf as AnyObject[]).map(item => {
      return {
        label: item.const as string,
        value: item.title as string,
      };
    }) as SelectInputOption[];
  }, [schema.oneOf]);

  return (
    <SelectInput
      placeholder="Select country"
      name={id}
      options={options}
      value={formData as string}
      onChange={onChange}
    />
  );
};
