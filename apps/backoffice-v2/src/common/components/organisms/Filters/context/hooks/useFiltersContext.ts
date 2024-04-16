import { filtersContext } from '@/common/components/organisms/Filters/context/filters.context';
import { useContext } from 'react';

export const useFiltersContext = () => useContext(filtersContext);
