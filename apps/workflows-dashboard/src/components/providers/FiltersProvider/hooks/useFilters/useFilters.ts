import { filtersContext } from '@/components/providers/FiltersProvider/filters-provider.context';
import { FiltersContext } from '@/components/providers/FiltersProvider/filters-provider.types';
import { Context, useContext } from 'react';

export const useFilters = <TValues = object>() =>
  useContext(filtersContext as unknown as Context<FiltersContext<TValues>>);
