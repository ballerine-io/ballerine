import { IFilterDefinition } from '@/common/components/organisms/Filters/interfaces';
import { TFiltersInputID } from '@/common/components/organisms/Filters/types';

export type TFiltersValuesMap = Record<TFiltersInputID, unknown>;

export type TFiltersContext = {
  filters: Array<IFilterDefinition<unknown>>;
  values: TFiltersValuesMap;
  onChange: (id: TFiltersInputID, value: unknown) => void;
  onClear: (id: TFiltersInputID) => void;
};
