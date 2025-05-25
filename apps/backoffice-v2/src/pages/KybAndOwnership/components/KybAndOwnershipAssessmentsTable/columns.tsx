import { Badge, TextWithNAFallback } from '@ballerine/ui';
import { createColumnHelper, RowData } from '@tanstack/react-table';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { useMemo } from 'react';
import { KybAndOwnershipAssessmentStatusBadge } from '../KybAndOwnershipAssessmentStatus/KybAndOwnershipAssessmentStatusBadge';
import { TKybAndOwnershipAssessment } from '@/domains/assessments/fetchers';

dayjs.extend(utc);
dayjs.extend(timezone);

// https://tanstack.com/table/v8/docs/api/core/column-def#meta
declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    conditional?: true;
    showColumn?: boolean;
  }
}

const columnHelper = createColumnHelper<TKybAndOwnershipAssessment>();

export const useColumns = () => {
  return useMemo(() => {
    const columns = [
      columnHelper.accessor('input.companyName', {
        cell: info => {
          const companyName = info.getValue();
          const isExample =
            ('isExample' in info.row.original && info.row.original.isExample) ?? false;

          return (
            <div className="ms-4 flex flex-col">
              <TextWithNAFallback className="font-semibold">{companyName}</TextWithNAFallback>
              {isExample && (
                <Badge className="py-0.7 mt-2 w-fit rounded-[5px] bg-black/10 px-2 text-xs text-black/60">
                  example
                </Badge>
              )}
            </div>
          );
        },
        header: 'Company Name',
      }),
      columnHelper.accessor('input.registrationNumber', {
        cell: info => {
          const registrationNumber = info.getValue();

          return <TextWithNAFallback>{registrationNumber}</TextWithNAFallback>;
        },
        header: 'Registration Number',
      }),
      columnHelper.accessor('input.country', {
        cell: info => {
          const jurisdictionCode = info.getValue();
          const country = jurisdictionCode?.replaceAll('/', ' ');

          return (
            <div className="flex flex-col">
              <TextWithNAFallback>{country}</TextWithNAFallback>
            </div>
          );
        },
        header: 'Country / State',
      }),
      columnHelper.accessor('input.businessId', {
        cell: info => {
          const businessId = info.getValue();

          return <TextWithNAFallback>{businessId}</TextWithNAFallback>;
        },
        header: 'Merchant ID',
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
      columnHelper.accessor('status', {
        cell: ({ getValue }) => {
          const status = getValue();

          return <KybAndOwnershipAssessmentStatusBadge status={status} />;
        },
        header: 'Status',
      }),
    ];

    return columns.filter(column => {
      const meta = column.meta;

      if (meta?.conditional) {
        return meta.showColumn;
      }

      return true;
    });
  }, []);
};
