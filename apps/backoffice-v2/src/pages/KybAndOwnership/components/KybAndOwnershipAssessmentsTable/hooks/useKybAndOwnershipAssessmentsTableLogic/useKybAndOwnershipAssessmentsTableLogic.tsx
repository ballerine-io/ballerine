import { IDataTableProps } from '@ballerine/ui';
import { Link } from 'react-router-dom';

import { useLocale } from '@/common/hooks/useLocale/useLocale';
import { TKybAndOwnershipAssessment } from '@/domains/assessments/fetchers';

export const useKybAndOwnershipAssessmentsTableLogic = () => {
  const locale = useLocale();

  const Cell: IDataTableProps<TKybAndOwnershipAssessment>['CellContentWrapper'] = ({
    cell,
    children,
  }) => <Link to={`/${locale}/kyb-and-ownership/${cell.row.id}`}>{children}</Link>;

  return { Cell };
};
