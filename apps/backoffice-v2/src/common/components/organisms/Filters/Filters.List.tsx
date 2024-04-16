import { useFiltersContext } from '@/common/components/organisms/Filters/context/hooks/useFiltersContext';
import {
  IFilterDefinition,
  IFiltersListProps,
} from '@/common/components/organisms/Filters/interfaces';
import { useFilter } from '@/common/hooks/useFilter/useFilter';
import { ctw } from '@/common/utils/ctw/ctw';
import { FunctionComponent, useCallback } from 'react';

export const FiltersList: FunctionComponent<IFiltersListProps> = ({ children, className }) => {
  const { filters, values } = useFiltersContext();
  const { onFilter } = useFilter();
  const onClearSelect = useCallback(
    (accessor: string) => () => {
      onFilter(accessor)([]);
    },
    [onFilter],
  );

  return (
    <div className={ctw('flex gap-x-2', className)}>
      {filters.map(filterDefinition =>
        children({
          filter: filterDefinition,
          value: values[filterDefinition.id],
          clear: onClearSelect(filterDefinition.id),
          inputParams: filterDefinition.params as IFilterDefinition['params'],
          onChange: onFilter(filterDefinition.id),
        }),
      )}
    </div>
  );
};
