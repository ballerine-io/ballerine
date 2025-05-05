import { MERCHANT_REPORT_TYPES_MAP } from '@ballerine/common';
import { TextWithNAFallback } from '@ballerine/ui';
import { createColumnHelper, RowData } from '@tanstack/react-table';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { useMemo } from 'react';

import { TBusinessReport } from '@/domains/business-reports/fetchers';

dayjs.extend(utc);
dayjs.extend(timezone);

// https://tanstack.com/table/v8/docs/api/core/column-def#meta
declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    conditional?: true;
    showColumn?: boolean;
  }
}

const columnHelper = createColumnHelper<TBusinessReport>();

const SCAN_TYPES = {
  ONBOARDING: 'Onboarding',
  MONITORING: 'Monitoring',
} as const;

const REPORT_TYPE_TO_SCAN_TYPE = {
  [MERCHANT_REPORT_TYPES_MAP.MERCHANT_REPORT_T1]: SCAN_TYPES.ONBOARDING,
  [MERCHANT_REPORT_TYPES_MAP.ONGOING_MERCHANT_REPORT_T1]: SCAN_TYPES.MONITORING,
} as const;

export const useColumns = ({ isDemoAccount = false }) => {
  return useMemo(() => {
    const columns = [
      columnHelper.accessor('id', {
        cell: info => {
          const id = info.getValue();

          return (
            <div className="ms-4 flex flex-col">
              <TextWithNAFallback className="font-semibold">{id}</TextWithNAFallback>
            </div>
          );
        },
        header: 'ID',
      }),
      columnHelper.accessor('status', {
        cell: info => {
          const status = info.getValue();

          return <TextWithNAFallback className="font-semibold">{status}</TextWithNAFallback>;
        },
        header: 'Status',
      }),
      columnHelper.accessor('updatedAt', {
        cell: info => {
          const displayDate = info.getValue();

          // Convert UTC time to local browser time
          const localDateTime = dayjs.utc(displayDate).local();

          const date = localDateTime.format('MMM DD, YYYY');
          const time = localDateTime.format('HH:mm');

          return (
            <div className={`flex flex-col space-y-0.5`}>
              <span>{date}</span>
              <span className={`text-xs text-[#999999]`}>{time}</span>
            </div>
          );
        },
        header: 'Updated At',
      }),
      columnHelper.accessor('createdAt', {
        cell: info => {
          const displayDate = info.getValue();

          // Convert UTC time to local browser time
          const localDateTime = dayjs.utc(displayDate).local();

          const date = localDateTime.format('MMM DD, YYYY');
          const time = localDateTime.format('HH:mm');

          return (
            <div className={`flex flex-col space-y-0.5`}>
              <span>{date}</span>
              <span className={`text-xs text-[#999999]`}>{time}</span>
            </div>
          );
        },
        header: 'Created At',
      }),
    ];

    return columns.filter(column => {
      const meta = column.meta;

      if (meta?.conditional) {
        return meta.showColumn;
      }

      return true;
    });
  }, [isDemoAccount]);
};
