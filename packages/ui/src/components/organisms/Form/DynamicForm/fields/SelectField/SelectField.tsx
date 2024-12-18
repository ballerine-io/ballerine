import { DropdownInput } from '@/components/molecules';
import { createTestId } from '@/components/organisms/Renderer';
import { useElement, useField } from '../../hooks/external';
import { FieldErrors } from '../../layouts/FieldErrors';
import { FieldLayout } from '../../layouts/FieldLayout';
import { TDynamicFormField } from '../../types';
import { useStack } from '../FieldList/providers/StackProvider';

export interface ISelectOption {
  value: string;
  label: string;
}

export interface ISelectFieldParams {
  placeholder?: string;
  options: ISelectOption[];
}

export const SelectField: TDynamicFormField<ISelectFieldParams> = ({ element }) => {
  const { stack } = useStack();
  const { id } = useElement(element, stack);
  const { value, disabled, onChange, onBlur, onFocus } = useField<string | undefined>(
    element,
    stack,
  );

  const { placeholder, options = [] } = element.params || {};

  return (
    <FieldLayout element={element}>
      <DropdownInput
        name={id}
        options={options}
        value={value}
        testId={createTestId(element, stack)}
        placeholdersParams={{
          placeholder: placeholder || '',
        }}
        disabled={disabled}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
      />
      <FieldErrors element={element} />
    </FieldLayout>
  );
};
