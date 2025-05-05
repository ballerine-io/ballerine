import { IDataTableProps } from '@ballerine/ui';
import { Link } from 'react-router-dom';

import { useLocale } from '@/common/hooks/useLocale/useLocale';
import { TBusinessReports } from '@/domains/business-reports/fetchers';

export const useIdentityVerificationTableLogic = () => {
  const locale = useLocale();

  const Cell: IDataTableProps<TBusinessReports['data'][number]>['CellContentWrapper'] = ({
    cell,
    children,
  }) => {
    return <Link to={`/${locale}/identity-verification/${cell.row.id}`}>{children}</Link>;
  };

  return { Cell };
};
