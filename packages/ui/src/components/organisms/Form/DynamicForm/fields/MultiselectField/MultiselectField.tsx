import { MultiSelect, MultiSelectOption, MultiSelectValue } from '@/components/molecules';
import { SelectedElementParams } from '@/components/molecules/inputs/MultiSelect/types';
import { useCallback, useMemo } from 'react';
import { useField } from '../../hooks/external';
import { useMountEvent } from '../../hooks/internal/useMountEvent';
import { useUnmountEvent } from '../../hooks/internal/useUnmountEvent';
import { FieldDescription } from '../../layouts/FieldDescription';
import { FieldErrors } from '../../layouts/FieldErrors';
import { FieldLayout } from '../../layouts/FieldLayout';
import { FieldPriorityReason } from '../../layouts/FieldPriorityReason';
import { TDynamicFormField } from '../../types';
import { useStack } from '../FieldList/providers/StackProvider';
import { MultiselectfieldSelectedItem } from './MultiselectFieldSelectedItem';

export interface MultiselectFieldOption {
  label: string;
  value: any;
}

export interface IMultiselectFieldParams {
  options: MultiselectFieldOption[];
  placeholder?: string;
}

export const MultiselectField: TDynamicFormField<IMultiselectFieldParams> = ({ element }) => {
  useMountEvent(element);
  useUnmountEvent(element);

  const { stack } = useStack();
  const { value, onChange, onBlur, onFocus, disabled } = useField<MultiSelectValue[] | undefined>(
    element,
    stack,
  );

  const multiselectOptions = useMemo(() => {
    return (
      element.params?.options?.map(option => ({ title: option.label, value: option.value })) || []
    );
  }, [element.params?.options]);

  const renderSelected = useCallback((params: SelectedElementParams, option: MultiSelectOption) => {
    return <MultiselectfieldSelectedItem option={option} params={params} />;
  }, []);

  const handleChange = useCallback(
    (value: MultiSelectValue[]) => {
      onChange(value.length ? value : undefined);
    },
    [onChange],
  );

  return (
    <FieldLayout element={element}>
      <MultiSelect
        value={value}
        disabled={disabled}
        searchPlaceholder={element.params?.placeholder}
        onChange={handleChange}
        onBlur={onBlur}
        onFocus={onFocus}
        options={multiselectOptions}
        renderSelected={renderSelected}
      />
      <FieldDescription element={element} />
      <FieldPriorityReason element={element} />
      <FieldErrors element={element} />
    </FieldLayout>
  );
};
