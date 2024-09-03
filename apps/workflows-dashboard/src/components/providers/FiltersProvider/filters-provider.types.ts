export type FiltersUpdater<TValues> = (filters: Partial<TValues>) => void;

export interface FiltersContext<TFilterValues = object> {
  filters: TFilterValues;
  updateFilters: FiltersUpdater<TFilterValues>;
}
