import { IFiltersProps } from '@/common/components/organisms/Filters/interfaces';

export type IFiltersProviderProps = Pick<
  IFiltersProps,
  'filters' | 'values' | 'onChange' | 'onClear'
>;
