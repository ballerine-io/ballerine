import { AutocompleteInput } from '@/components/molecules';
import { createTestId } from '@/components/organisms/Renderer';
import { useField } from '../../hooks/external';
import { FieldLayout } from '../../layouts/FieldLayout';
import { TBaseFormElements, TDynamicFormField } from '../../types';
import { useStack } from '../FieldList/providers/StackProvider';

export interface IAutocompleteFieldOption {
  label: string;
  value: string;
}

export interface IAutocompleteFieldParams {
  placeholder?: string;
  options: IAutocompleteFieldOption[];
}

export const AutocompleteField: TDynamicFormField<TBaseFormElements, IAutocompleteFieldParams> = ({
  element,
}) => {
  const { params } = element;
  const { stack } = useStack();
  const { value, onChange, onBlur, disabled } = useField<string | undefined>(element, stack);
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
      />
    </FieldLayout>
  );
};
