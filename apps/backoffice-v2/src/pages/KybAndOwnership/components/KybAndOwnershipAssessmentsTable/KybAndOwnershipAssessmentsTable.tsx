import type { FunctionComponent } from 'react';

import { UrlDataTable } from '@/common/components/organisms/UrlDataTable/UrlDataTable';
import { useKybAndOwnershipAssessmentsTableLogic } from './hooks/useKybAndOwnershipAssessmentsTableLogic/useKybAndOwnershipAssessmentsTableLogic';
import { useColumns } from './columns';
import { TKybAndOwnershipAssessments } from '@/domains/assessments/fetchers';

export const KybAndOwnershipAssessmentsTable: FunctionComponent<{
  data: TKybAndOwnershipAssessments['data'];
  isDemoAccount: boolean;
}> = ({ data }) => {
  const { Cell } = useKybAndOwnershipAssessmentsTableLogic();
  const columns = useColumns();

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
