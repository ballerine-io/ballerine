import { FiltersUpdater } from '@/components/providers/FiltersProvider/filters-provider.types';

export interface FiltersProps<TFilterValues = object> {
  filters: TFilterValues;
  updateFilters: FiltersUpdater<TFilterValues>;
}
