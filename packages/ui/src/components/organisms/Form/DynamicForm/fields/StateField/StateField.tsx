import { useStateManagerContext } from '@/components/organisms/DynamicUI/StateManager/components/StateProvider';
import { getCountryStates } from '@/helpers/countries-data';
import { FieldLayout } from '@/pages/CollectionFlowV2/components/ui/field-parts/FieldLayout';
import { IFieldComponentProps } from '@/pages/CollectionFlowV2/types';
import { createTestId, DropdownInput } from '@ballerine/ui';
import get from 'lodash/get';
import { FunctionComponent, useMemo } from 'react';

export interface IStateFieldOptions {
  placeholder?: string;
  countryCodePath?: string;
  countryCode?: string;
}

export const StateField: FunctionComponent<IFieldComponentProps<string, IStateFieldOptions>> = ({
  fieldProps,
  definition,
  options = {},
  stack,
}) => {
  const { value, disabled, onChange, onBlur } = fieldProps;
  const {
    placeholder = 'Select State',
    countryCodePath = '',
    countryCode: _defaultCountryCode = 'US',
  } = options;

  const { payload } = useStateManagerContext();
  const dropdownOptions = useMemo(() => {
    const countryCode = get(payload, countryCodePath, _defaultCountryCode) as string;

    return (
      countryCode
        ? getCountryStates(countryCode).map(state => ({ title: state.name, const: state.isoCode }))
        : []
    ).map(option => ({
      label: option.title,
      value: option.const,
    }));
  }, [payload, countryCodePath, _defaultCountryCode]);

  return (
    <FieldLayout definition={definition} stack={stack}>
      <DropdownInput
        name={createTestId(definition, stack)}
        options={dropdownOptions}
        placeholdersParams={{ placeholder }}
        value={value}
        disabled={disabled}
        searchable
        testId={createTestId(definition, stack)}
        onChange={onChange}
        onBlur={onBlur}
      />
    </FieldLayout>
  );
};
