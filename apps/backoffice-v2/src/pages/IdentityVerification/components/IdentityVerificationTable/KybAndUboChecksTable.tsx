import type { FunctionComponent } from 'react';

import { UrlDataTable } from '@/common/components/organisms/UrlDataTable/UrlDataTable';
import { TBusinessReports } from '@/domains/business-reports/fetchers';
import { useIdentityVerificationTableLogic } from './hooks/useIdentityVerificationTableLogic/useIdentityVerificationTableLogic';
import { useColumns } from './columns';

export const IdentityVerificationTable: FunctionComponent<{
  data: TBusinessReports['data'];
  isDemoAccount: boolean;
}> = ({ data, isDemoAccount }) => {
  const { Cell } = useIdentityVerificationTableLogic();
  const columns = useColumns({ isDemoAccount });

  return (
    <UrlDataTable
      data={data}
      columns={columns}
      CellContentWrapper={Cell}
      options={{
        enableSorting: false,
        initialState: {
          sorting: [{ id: 'createdAt', desc: true }],
        },
      }}
      props={{ scroll: { className: 'h-full' }, cell: { className: '!p-0' } }}
    />
  );
};
