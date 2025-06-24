import type { FunctionComponent } from 'react';

import { UrlDataTable } from '@/common/components/organisms/UrlDataTable/UrlDataTable';
import { useAssessmentsTableLogic } from './hooks/useAssessmentsTableLogic/useAssessmentsTableLogic';
import { useColumns } from './columns';
import { IAssessmentType, TAssessments } from '@/domains/assessments/fetchers';

export const AssessmentsTable: FunctionComponent<{
  data: TAssessments['data'];
  type: IAssessmentType;
}> = ({ data, type }) => {
  const { Cell } = useAssessmentsTableLogic(type);
  const columns = useColumns(type);

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
