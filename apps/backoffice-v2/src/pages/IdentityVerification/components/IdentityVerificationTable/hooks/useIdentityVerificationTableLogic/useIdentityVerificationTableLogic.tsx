import { IDataTableProps } from '@ballerine/ui';
import { Link } from 'react-router-dom';

import { useLocale } from '@/common/hooks/useLocale/useLocale';
import { TIdentityVerificationAssessments } from '@/domains/assessments/fetchers';

export const useIdentityVerificationTableLogic = () => {
  const locale = useLocale();

  const Cell: IDataTableProps<
    TIdentityVerificationAssessments['data'][number]
  >['CellContentWrapper'] = ({ cell, children }) => {
    return <Link to={`/${locale}/identity-verification/${cell.row.id}`}>{children}</Link>;
  };

  return { Cell };
};
