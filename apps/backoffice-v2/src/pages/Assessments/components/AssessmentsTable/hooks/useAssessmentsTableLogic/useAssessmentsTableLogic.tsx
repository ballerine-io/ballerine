import { IDataTableProps } from '@ballerine/ui';
import { Link } from 'react-router-dom';

import { useLocale } from '@/common/hooks/useLocale/useLocale';
import { IAssessmentType, TKybAndOwnershipAssessment } from '@/domains/assessments/fetchers';
import { kebabCase } from 'lodash-es';

export const useAssessmentsTableLogic = (type: IAssessmentType) => {
  const locale = useLocale();

  const Cell: IDataTableProps<TKybAndOwnershipAssessment>['CellContentWrapper'] = ({
    cell,
    children,
  }) => <Link to={`/${locale}/assessments/${kebabCase(type)}/${cell.row.id}`}>{children}</Link>;

  return { Cell };
};
