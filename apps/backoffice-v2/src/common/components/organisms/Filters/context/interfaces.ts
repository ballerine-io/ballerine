import { IFiltersProps } from '@/common/components/organisms/Filters/interfaces';
import { AnyChildren } from '@ballerine/ui';

export interface IFiltersProviderProps
  extends Pick<IFiltersProps, 'filters' | 'values' | 'onChange' | 'onClear'> {
  children: AnyChildren;
}
