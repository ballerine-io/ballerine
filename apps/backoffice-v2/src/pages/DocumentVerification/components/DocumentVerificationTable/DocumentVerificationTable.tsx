import type { FunctionComponent } from 'react';

import { UrlDataTable } from '@/common/components/organisms/UrlDataTable/UrlDataTable';
import { TDocumentVerificationCheck } from '@/domains/document-verification/fetchers';
import { useDocumentVerificationTableLogic } from './hooks/useDocumentVerificationTableLogic/useDocumentVerificationTableLogic';
import { useColumns } from './columns';

export const DocumentVerificationTable: FunctionComponent<{
  data: TDocumentVerificationCheck[];
  isDemoAccount?: boolean;
}> = ({ data, isDemoAccount }) => {
  const { Cell } = useDocumentVerificationTableLogic();
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
