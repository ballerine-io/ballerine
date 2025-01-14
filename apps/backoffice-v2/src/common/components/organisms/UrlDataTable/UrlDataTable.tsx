import { useRadixScrollBoundaries } from '@/common/hooks/useRadixScrollBoundaries/useRadixScrollBoundaries';
import { useSelect } from '@/common/hooks/useSelect/useSelect';
import { useSort } from '@/common/hooks/useSort/useSort';
import { DataTable } from '@ballerine/ui';
import { ComponentProps, FunctionComponent } from 'react';
import { PartialDeep } from 'type-fest';

export const UrlDataTable: FunctionComponent<
  Omit<ComponentProps<typeof DataTable>, 'sort' | 'select'> &
    PartialDeep<Pick<ComponentProps<typeof DataTable>, 'sort' | 'select'>>
> = props => {
  const { sortDir, sortBy, onSort } = useSort();
  const { selected, onSelect } = useSelect();
  const { ref, handleScroll } = useRadixScrollBoundaries();

  return (
    <DataTable
      {...props}
      ref={ref}
      handleScroll={handleScroll}
      sort={{
        sortBy,
        sortDir,
        onSort,
        ...props.sort,
      }}
      select={{
        selected,
        onSelect,
        ...props.select,
      }}
    />
  );
};
