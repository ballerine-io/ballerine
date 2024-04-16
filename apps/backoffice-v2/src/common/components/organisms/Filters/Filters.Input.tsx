import { MultiselectFilterInput } from '@/common/components/organisms/Filters/filter-inputs/MultiSelectFilterInput';
import { IFilterInputParams } from '@/common/components/organisms/Filters/interfaces';
import { TFilterInputType } from '@/common/components/organisms/Filters/types';
import { FunctionComponent, useMemo } from 'react';

const getFilterInputComponent = (
  type: TFilterInputType,
): React.ComponentType<IFilterInputParams> => {
  if (type === 'multi-select')
    return MultiselectFilterInput as React.ComponentType<IFilterInputParams>;

  throw new Error(`Filter input for type ${type} not implemented.`);
};

export const FiltersInput: FunctionComponent<IFilterInputParams> = props => {
  const InputComponent = useMemo(() => getFilterInputComponent(props.filter.type), [props.filter]);

  return <InputComponent {...props} />;
};
