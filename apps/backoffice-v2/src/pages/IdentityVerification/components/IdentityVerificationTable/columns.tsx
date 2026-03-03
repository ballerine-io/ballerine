import { Badge, ContentTooltip, TextWithNAFallback, WarningFilledSvg } from '@ballerine/ui';
import { createColumnHelper, RowData } from '@tanstack/react-table';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { useMemo } from 'react';

import { ctw } from '@/common/utils/ctw/ctw';
import { TIdentityVerificationAssessment } from '@/domains/assessments/fetchers';
import { titleCase } from 'string-ts';

dayjs.extend(utc);
dayjs.extend(timezone);

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    conditional?: true;
    showColumn?: boolean;
  }
}

const columnHelper = createColumnHelper<TIdentityVerificationAssessment>();

export const useColumns = ({ isDemoAccount = false }) => {
  return useMemo(() => {
    const columns = [
      columnHelper.accessor('firstName', {
        cell: info => {
          const firstName = info.getValue();
          const lastName = info.row.original.lastName;

          return (
            <div className="ms-4 flex flex-col">
              <TextWithNAFallback className="font-semibold">{`${firstName} ${lastName}`}</TextWithNAFallback>
            </div>
          );
        },
        header: 'Full Name',
      }),
      columnHelper.accessor('email', {
        cell: ({ getValue }) => (
          <TextWithNAFallback className="inline-block max-w-[24ch] truncate">
            {getValue()}
          </TextWithNAFallback>
        ),
        header: 'Email',
      }),
      columnHelper.accessor('issues', {
        cell: info => {
          const issues = info.getValue() || [];

          return (
            <ContentTooltip
              description={
                <>
                  <p className="mb-4 text-base font-bold">Issues</p>
                  {issues.length === 0 && <div className="text-sm text-slate-500">No issues</div>}
                  {issues.slice(0, 4).map((issue, index) => (
                    <div key={index} className="space-x-1 text-sm">
                      <WarningFilledSvg className={ctw('inline-block text-slate-500 d-5')} />
                      <span className="text-slate-500">{issue}</span>
                    </div>
                  ))}
                  {issues.length > 4 && (
                    <div className="mt-2 text-sm text-slate-500">
                      + {issues.length - 4} additional issue
                      {issues.length - 4 > 1 ? 's' : ''}
                    </div>
                  )}
                </>
              }
              props={{
                tooltipTrigger: { className: 'mx-auto pr-0' },
                tooltipContent: {
                  align: 'center',
                  side: 'top',
                  className: 'bg-background text-primary',
                },
              }}
            >
              <div
                className={ctw(
                  'flex items-center justify-center rounded-full text-xs font-bold d-5',
                  {
                    'bg-warning/20 text-warning': issues.length > 0,
                    'bg-slate-500/20 text-slate-500': issues.length === 0,
                  },
                )}
              >
                {issues.length}
              </div>
            </ContentTooltip>
          );
        },
        header: () => <p className="text-center">Issues</p>,
      }),
      columnHelper.accessor('createdAt', {
        cell: info => {
          const dateValue = info.getValue();
          const localDateTime = dayjs.utc(dateValue).local();

          return (
            <div className="flex flex-col space-y-0.5">
              <span>{localDateTime.format('MMM DD, YYYY')}</span>
              <span className="text-xs text-[#999999]">{localDateTime.format('HH:mm')}</span>
            </div>
          );
        },
        header: 'Created At',
      }),
      columnHelper.accessor('assessmentId', {
        cell: info => <TextWithNAFallback>{info.getValue()}</TextWithNAFallback>,
        header: 'Assessment ID',
      }),
      columnHelper.accessor('status', {
        cell: ({ getValue }) => {
          const status = getValue();
          const statusToLabelMap = {
            pending: 'Pending',
            verified: 'Verified',
            rejected: 'Rejected',
          } as const;

          return (
            <Badge
              className={ctw('h-6 space-x-1 text-sm font-medium', {
                'bg-[#E3E2E0]': status === 'pending',
                'bg-[#DBEDDB]': status === 'verified',
                'bg-[#ECA1A5]': status === 'rejected',
              })}
            >
              <span
                className={ctw('rounded-full d-2', {
                  'bg-[#91918E]': status === 'pending',
                  'bg-[#6C9B7D]': status === 'verified',
                  'bg-[#DF2222]': status === 'rejected',
                })}
              >
                &nbsp;
              </span>
              <span
                style={{ width: '100%' }}
                className={ctw('text-sm', {
                  'text-[#32302C]': status === 'pending',
                  'text-[#1C3829]': status === 'verified' || status === 'rejected',
                })}
              >
                {statusToLabelMap[status] ?? titleCase(status ?? '')}
              </span>
            </Badge>
          );
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
  }, [isDemoAccount]);
};
