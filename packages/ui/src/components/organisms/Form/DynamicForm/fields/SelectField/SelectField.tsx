import { DropdownInput } from '@/components/molecules';
import { createTestId } from '@/components/organisms/Renderer';
import { useElement, useField } from '../../hooks/external';
import { IFieldLayoutBaseParams } from '../../layouts/FieldLayout';
import { TDynamicFormField } from '../../types';
import { useStack } from '../FieldList/providers/StackProvider';

export interface ISelectOption {
  value: string;
  label: string;
}

export interface ISelectFieldParams extends IFieldLayoutBaseParams {
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
  );
};
