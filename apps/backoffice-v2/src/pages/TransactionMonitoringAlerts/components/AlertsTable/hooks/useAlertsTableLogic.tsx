import { useLocale } from '@/common/hooks/useLocale/useLocale';
import { Link, useLocation } from 'react-router-dom';
import React, { useCallback } from 'react';
import { IDataTableProps } from '@/common/components/organisms/DataTable/DataTable';
import { TAlerts } from '@/domains/alerts/fetchers';

interface IUseAlertsTableLogic {
  data: TAlerts;
}

export const useAlertsTableLogic = ({ data }: IUseAlertsTableLogic) => {
  const locale = useLocale();
  const { pathname, search } = useLocation();

  const onClick = useCallback(() => {
    sessionStorage.setItem(
      'transaction-monitoring:transactions-drawer:previous-path',
      `${pathname}${search}`,
    );
  }, [pathname, search]);

  const Cell: IDataTableProps<typeof data>['CellContentWrapper'] = ({ cell, children }) => {
    const itemId = cell.id.replace(`_${cell.column.id}`, '');
    const item = data.find(item => item.id === itemId);

    if (cell.column.id === 'select') {
      return children;
    }

    return (
      <Link
        to={`/${locale}/transaction-monitoring/alerts/${itemId}${search}&businessId=${
          item?.merchant?.id ?? ''
        }&counterpartyId=${item?.counterpartyId ?? ''}`}
        onClick={onClick}
        className={`d-full flex p-4`}
      >
        {children}
      </Link>
    );
  };

  return { Cell };
};
