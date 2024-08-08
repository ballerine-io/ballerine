import { ComponentProps, FunctionComponent } from 'react';
import { useSort } from '@/common/hooks/useSort/useSort';
import { useSelect } from '@/common/hooks/useSelect/useSelect';
import { DataTable } from '@ballerine/ui';
import { PartialDeep } from 'type-fest';

export const UrlDataTable: FunctionComponent<
  Omit<ComponentProps<typeof DataTable>, 'sort' | 'select'> &
    PartialDeep<Pick<ComponentProps<typeof DataTable>, 'sort' | 'select'>>
> = props => {
  const { sortDir, sortBy, onSort } = useSort();
  const { selected, onSelect } = useSelect();

  return (
    <DataTable
      {...props}
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
