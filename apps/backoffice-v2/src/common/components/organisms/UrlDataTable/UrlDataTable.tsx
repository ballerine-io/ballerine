import { ComponentProps, FunctionComponent } from 'react';
import { DataTable } from '../../../../../../../packages/ui/src/components/organisms/DataTable/DataTable';
import { useSort } from '@/common/hooks/useSort/useSort';
import { useSelect } from '@/common/hooks/useSelect/useSelect';

export const UrlDataTable: FunctionComponent<
  Omit<ComponentProps<typeof DataTable>, 'sort' | 'select'> &
    DeepPartial<Pick<ComponentProps<typeof DataTable>, 'sort' | 'select'>>
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
