import { MultiSelect, MultiSelectOption, MultiSelectValue } from '@/components/molecules';
import { SelectedElementParams } from '@/components/molecules/inputs/MultiSelect/types';
import { useCallback } from 'react';
import { useField } from '../../hooks/external';
import { FieldErrors } from '../../layouts/FieldErrors';
import { FieldLayout } from '../../layouts/FieldLayout';
import { TDynamicFormField } from '../../types';
import { useStack } from '../FieldList/providers/StackProvider';
import { MultiselectfieldSelectedItem } from './MultiselectFieldSelectedItem';

export interface IMultiselectFieldParams {
  options: MultiSelectOption[];
}

export const MultiselectField: TDynamicFormField<IMultiselectFieldParams> = ({ element }) => {
  const { stack } = useStack();
  const { value, onChange, onBlur, onFocus, disabled } = useField<MultiSelectValue[] | undefined>(
    element,
    stack,
  );

  const renderSelected = useCallback((params: SelectedElementParams, option: MultiSelectOption) => {
    return <MultiselectfieldSelectedItem option={option} params={params} />;
  }, []);

  return (
    <FieldLayout element={element}>
      <MultiSelect
        value={value}
        disabled={disabled}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
        options={element.params?.options || []}
        renderSelected={renderSelected}
      />
      <FieldErrors element={element} />
    </FieldLayout>
  );
};
