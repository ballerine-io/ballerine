import { IFiltersProviderProps } from '@/common/components/organisms/Filters/context/interfaces';
import { TFiltersContext } from '@/common/components/organisms/Filters/context/types';
import { createFilterValuesMap } from '@/common/components/organisms/Filters/context/utils/create-filter-values-map';
import { TFiltersInputID } from '@/common/components/organisms/Filters/types';
import { FunctionComponent, useCallback, useMemo } from 'react';
import { filtersContext } from './filters.context';

const { Provider } = filtersContext;

export const FiltersProvider: FunctionComponent<IFiltersProviderProps> = ({
  children,
  values,
  filters,
  onChange,
  onClear,
}) => {
  const handleChange = useCallback(
    (id: TFiltersInputID, value: unknown) => {
      onChange({ id, value });
    },
    [onChange],
  );

  const handleClear = useCallback(
    (id: TFiltersInputID) => {
      onClear(id);
    },
    [onClear],
  );

  const context: TFiltersContext = useMemo(
    () => ({
      values: createFilterValuesMap({ filters, values: values ?? [] }),
      filters,
      onChange: handleChange,
      onClear: handleClear,
    }),
    [values, filters, handleChange, handleClear],
  );

  return <Provider value={context}>{children}</Provider>;
};
