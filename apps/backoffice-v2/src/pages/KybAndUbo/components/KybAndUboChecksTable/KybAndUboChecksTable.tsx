import type { FunctionComponent } from 'react';

import { UrlDataTable } from '@/common/components/organisms/UrlDataTable/UrlDataTable';
import { TBusinessReports } from '@/domains/business-reports/fetchers';
import { useKybAndUboTableLogic } from './hooks/useKybAndUboTableLogic/useKybAndUboTableLogic';
import { useColumns } from './columns';

export const KybAndUboChecksTable: FunctionComponent<{
  data: TBusinessReports['data'];
  isDemoAccount: boolean;
}> = ({ data, isDemoAccount }) => {
  const { Cell } = useKybAndUboTableLogic();
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
