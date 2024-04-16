import { FiltersProvider } from '@/common/components/organisms/Filters/context/FiltersProvider';
import { IFiltersProps } from '@/common/components/organisms/Filters/interfaces';
import { ctw } from '@ballerine/ui';
import { FunctionComponent } from 'react';

export const Filters: FunctionComponent<IFiltersProps> = ({
  filters,
  values = [],
  children,
  className,
  onChange,
  onClear,
}) => {
  return (
    <FiltersProvider filters={filters} values={values} onChange={onChange} onClear={onClear}>
      <div className={ctw('flex flex-col', className)}>{children}</div>
    </FiltersProvider>
  );
};
