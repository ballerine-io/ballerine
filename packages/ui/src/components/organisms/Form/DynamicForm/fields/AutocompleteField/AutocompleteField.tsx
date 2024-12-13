import { FieldLayout } from '@/pages/CollectionFlowV2/components/ui/field-parts/FieldLayout';
import { IFieldComponentProps } from '@/pages/CollectionFlowV2/types';
import { AutocompleteInput, createTestId } from '@ballerine/ui';
import { FunctionComponent } from 'react';

export interface IAutocompleteFieldOption {
  label: string;
  value: string;
}

export interface IAutocompleteFieldOptions {
  placeholder?: string;
  options: IAutocompleteFieldOption[];
}

export const AutocompleteField: FunctionComponent<
  IFieldComponentProps<string, IAutocompleteFieldOptions>
> = ({ fieldProps, definition, options: _options, stack }) => {
  const { value, onChange, onBlur, disabled } = fieldProps;
  const { options = [], placeholder = '' } = _options;

  return (
    <FieldLayout definition={definition} stack={stack}>
      <AutocompleteInput
        disabled={disabled}
        value={value}
        options={options}
        testId={createTestId(definition, stack)}
        placeholder={placeholder}
        onChange={event => onChange(event.target.value || '')}
        onBlur={onBlur}
      />
    </FieldLayout>
  );
};
