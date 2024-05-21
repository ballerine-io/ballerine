import { MultiSelect } from '@/common/components/atoms/MultiSelect/MultiSelect';
import { IFilterInputParams } from '@/common/components/organisms/Filters/interfaces';
import { FunctionComponent } from 'react';

export interface IMultiSelectFilterParams {
  type: 'multi-select';
  options: Array<{
    name: string;
    value: string;
  }>;
}

export const MultiselectFilterInput: FunctionComponent<
  IFilterInputParams<IMultiSelectFilterParams, Array<string | null>>
> = ({ inputParams, filter, value, onChange, clear }) => {
  const { options } = inputParams;

  return (
    <MultiSelect
      title={filter.label}
      selectedValues={value ?? []}
      onSelect={onChange}
      onClearSelect={clear}
      options={options || []}
    />
  );
};
