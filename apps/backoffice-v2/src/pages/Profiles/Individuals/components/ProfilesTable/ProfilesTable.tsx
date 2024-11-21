import React, { FunctionComponent } from 'react';
import { IProfilesTableProps } from '@/pages/Profiles/Individuals/components/ProfilesTable/interfaces';
import { IDataTableProps } from '@/common/components/organisms/DataTable/DataTable';
import { columns } from './columns';
import { UrlDataTable } from '@/common/components/organisms/UrlDataTable/UrlDataTable';

export const ProfilesTable: FunctionComponent<IProfilesTableProps> = ({ data }) => {
  // const locale = useLocale();
  // const { search } = useLocation();

  const Cell: IDataTableProps<typeof data>['CellContentWrapper'] = ({ cell, children }) => {
    return (
      <span
        // to={`/${locale}/profiles/individuals/${cell.row.id}${search}`}
        className={`d-full flex p-4`}
      >
        {children}
      </span>
    );
  };

  return (
    <UrlDataTable
      data={data}
      columns={columns}
      CellContentWrapper={Cell}
      options={{
        initialState: {
          sorting: [{ id: 'createdAt', desc: true }],
        },
      }}
      props={{ scroll: { className: 'h-full' }, cell: { className: '!p-0' } }}
    />
  );
};
