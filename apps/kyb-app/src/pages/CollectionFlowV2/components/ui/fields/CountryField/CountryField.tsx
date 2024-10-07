import { getCountries } from '@/helpers/countries-data';
import { FieldLayout } from '@/pages/CollectionFlowV2/components/ui/field-parts/FieldLayout';
import { IFieldComponentProps } from '@/pages/CollectionFlowV2/types';
import { DropdownInput } from '@ballerine/ui';
import { FunctionComponent, useMemo } from 'react';

export interface ICountryFieldOptions {
  placeholder?: string;
}

export const CountryField: FunctionComponent<
  IFieldComponentProps<string, ICountryFieldOptions>
> = ({ fieldProps, definition, options, stack }) => {
  const { value, disabled, onChange, onBlur } = fieldProps;
  const { placeholder = '' } = options || {};

  const dropdownOptions = useMemo(() => {
    return getCountries().map(country => ({
      value: country.const,
      label: country.title,
    }));
  }, []);

  return (
    <FieldLayout definition={definition} stack={stack}>
      <DropdownInput
        name="country"
        options={dropdownOptions}
        placeholdersParams={{
          placeholder,
        }}
        onChange={onChange}
        value={value}
        disabled={disabled}
        onBlur={onBlur}
      />
    </FieldLayout>
  );
};
