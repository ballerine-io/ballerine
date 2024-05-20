import { filtersContext } from '@/common/components/organisms/Filters/context/filters.context';
import { useContext } from 'react';

export const useFiltersContext = () => {
  const values = useContext(filtersContext);

  if (!values) {
    throw new Error('useFiltersContext must be used within a FiltersContext.');
  }

  return values;
};
