import { TFiltersValuesMap } from '@/common/components/organisms/Filters/context/types';
import { IFilterDefinition, IFilterValue } from '@/common/components/organisms/Filters/interfaces';

export const createFilterValuesMap = ({
  filters,
  values,
}: {
  filters: Array<IFilterDefinition<unknown>>;
  values: IFilterValue[];
}) => {
  const plainValues = values.reduce((object, value) => {
    object[value.accessor] = value.value;

    return object;
  }, {} as Record<string, unknown>);

  const valuesMap = filters.reduce((object, filter) => {
    object[filter.id] = plainValues[filter.id] ?? filter.defaultValue;

    return object;
  }, {} as TFiltersValuesMap);

  return valuesMap;
};
