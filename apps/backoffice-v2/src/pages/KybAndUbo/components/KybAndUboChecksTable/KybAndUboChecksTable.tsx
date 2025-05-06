import type { FunctionComponent } from 'react';

import { UrlDataTable } from '@/common/components/organisms/UrlDataTable/UrlDataTable';
import { useKybAndUboTableLogic } from './hooks/useKybAndUboTableLogic/useKybAndUboTableLogic';
import { useColumns } from './columns';
import { TKybAndUbosChecks } from '@/domains/checks/fetchers';

export const KybAndUboChecksTable: FunctionComponent<{
  data: TKybAndUbosChecks['data'];
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
