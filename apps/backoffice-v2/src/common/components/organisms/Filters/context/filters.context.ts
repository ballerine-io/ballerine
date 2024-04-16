import { TFiltersContext } from '@/common/components/organisms/Filters/context/types';
import { createContext } from 'react';

const initialContext: TFiltersContext = {
  filters: [],
  values: {},
  onChange: () => {
    return;
  },
  onClear: () => {
    return;
  },
};

export const filtersContext = createContext(initialContext);
