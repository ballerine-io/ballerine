import { useLocale } from '@/common/hooks/useLocale/useLocale';

import { IDataTableProps } from '@/common/components/organisms/DataTable/DataTable';
import { TBusinessAlerts } from '@/domains/business-alerts/fetchers';
import { useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';

export const useBusinessAlertsTableLogic = ({ data }: { data: TBusinessAlerts }) => {
  const locale = useLocale();
  const { pathname, search } = useLocation();

  const onClick = useCallback(() => {
    sessionStorage.setItem(
      'business-transaction-monitoring:transactions-drawer:previous-path',
      `${pathname}${search}`,
    );
  }, [pathname, search]);

  const Cell: IDataTableProps<typeof data>['CellContentWrapper'] = ({ cell, children }) => {
    const itemId = cell.id.replace(`_${cell.column.id}`, '');
    const item = data.find(item => item.id === itemId);

    return (
      <Link
        to={`/${locale}/businesses/alerts/${itemId}${search}&businessId=${
          item?.additionalInfo?.businessId ?? ''
        }`}
        onClick={onClick}
        className={`d-full flex p-4`}
      >
        {children}
      </Link>
    );
  };

  return { Cell };
};
