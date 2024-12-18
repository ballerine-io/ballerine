import { AutocompleteInput } from '@/components/molecules';
import { createTestId } from '@/components/organisms/Renderer';
import { useField } from '../../hooks/external/useField';
import { FieldLayout } from '../../layouts/FieldLayout';
import { TDynamicFormField } from '../../types';
import { useStack } from '../FieldList/providers/StackProvider';

export interface IAutocompleteFieldOption {
  label: string;
  value: string;
}

export interface IAutocompleteFieldParams {
  placeholder?: string;
  options: IAutocompleteFieldOption[];
}

export const AutocompleteField: TDynamicFormField<IAutocompleteFieldParams> = ({ element }) => {
  const { params } = element;
  const { stack } = useStack();
  const { value, onChange, onBlur, onFocus, disabled } = useField<string | undefined>(
    element,
    stack,
  );
  const { options = [], placeholder = '' } = params || {};

  return (
    <FieldLayout element={element}>
      <AutocompleteInput
        disabled={disabled}
        value={value}
        options={options}
        data-testid={createTestId(element, stack)}
        placeholder={placeholder}
        onChange={event => onChange(event.target.value || '')}
        onBlur={onBlur}
        onFocus={onFocus}
      />
    </FieldLayout>
  );
};
