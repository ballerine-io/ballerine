import React, { FunctionComponent } from 'react';
import { IProfilesTableProps } from '@/pages/Profiles/Individuals/components/ProfilesTable/interfaces';
import { DataTable, IDataTableProps } from '@/common/components/organisms/DataTable/DataTable';
import { columns } from './columns';

export const ProfilesTable: FunctionComponent<IProfilesTableProps> = ({ data }) => {
  // const locale = useLocale();
  // const { search } = useLocation();

  const Cell: IDataTableProps<typeof data>['CellContentWrapper'] = ({ cell, children }) => {
    // const itemId = cell.id.replace(`_${cell.column.id}`, '');

    return (
      <span
        // to={`/${locale}/profiles/individuals/${itemId}${search}`}
        className={`d-full flex p-4`}
      >
        {children}
      </span>
    );
  };

  return (
    <DataTable
      data={data}
      columns={columns}
      CellContentWrapper={Cell}
      sortByField={`createdAt`}
      props={{ scroll: { className: 'h-full' }, cell: { className: '!p-0' } }}
    />
  );
};
