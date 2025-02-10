import { DataTable } from '@ballerine/ui';
import { ComponentProps, FunctionComponent } from 'react';
import { PartialDeep } from 'type-fest';

import { usePersistentScroll } from '@/common/hooks/usePersistentScroll/usePersistentScroll';
import { useSelect } from '@/common/hooks/useSelect/useSelect';
import { useSort } from '@/common/hooks/useSort/useSort';

export const UrlDataTable: FunctionComponent<
  Omit<ComponentProps<typeof DataTable>, 'sort' | 'select'> &
    PartialDeep<Pick<ComponentProps<typeof DataTable>, 'sort' | 'select'>>
> = props => {
  const { sortDir, sortBy, onSort } = useSort();
  const { selected, onSelect } = useSelect();
  const { ref, handleScroll } = usePersistentScroll();

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
