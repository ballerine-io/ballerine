import { UPDATEABLE_REPORT_STATUSES } from '@ballerine/common';
import { IDataTableProps } from '@ballerine/ui';
import { Link } from 'react-router-dom';

import { useLocale } from '@/common/hooks/useLocale/useLocale';
import { TBusinessReports } from '@/domains/business-reports/fetchers';

export const useMerchantMonitoringTableLogic = () => {
  const locale = useLocale();

  const Cell: IDataTableProps<TBusinessReports['data'][number]>['CellContentWrapper'] = ({
    cell,
    children,
  }) => {
    return UPDATEABLE_REPORT_STATUSES.includes(cell.row.original.status) ? (
      <Link to={`/${locale}/merchant-monitoring/${cell.row.id}`}>{children}</Link>
    ) : (
      <div className="opacity-50">{children}</div>
    );
  };

  return { Cell };
};
