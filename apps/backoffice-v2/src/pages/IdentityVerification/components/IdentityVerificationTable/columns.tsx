import { MERCHANT_REPORT_TYPES_MAP } from '@ballerine/common';
import { Badge, ContentTooltip, TextWithNAFallback, WarningFilledSvg } from '@ballerine/ui';
import { createColumnHelper, RowData } from '@tanstack/react-table';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { useMemo } from 'react';

import { ctw } from '@/common/utils/ctw/ctw';
import { TIdentityVerificationCheck } from '@/domains/identity-verification/fetchers';
import { titleCase } from 'string-ts';

dayjs.extend(utc);
dayjs.extend(timezone);

// https://tanstack.com/table/v8/docs/api/core/column-def#meta
declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    conditional?: true;
    showColumn?: boolean;
  }
}

const columnHelper = createColumnHelper<TIdentityVerificationCheck>();

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
      columnHelper.accessor('firstName', {
        cell: info => {
          const firstName = info.getValue();
          const lastName = info.row.original.lastName;
          const fullName = `${firstName} ${lastName}`;

          return (
            <div className="ms-4 flex flex-col">
              <TextWithNAFallback className="font-semibold">{fullName}</TextWithNAFallback>
            </div>
          );
        },
        header: 'Full Name',
      }),
      columnHelper.accessor('data', {
        cell: ({ getValue }) => {
          const website = (getValue() as { website?: string })?.website || 'https://example.com';

          return (
            <TextWithNAFallback className="inline-block w-32 truncate">
              {website}
            </TextWithNAFallback>
          );
        },
        header: 'Website',
      }),
      columnHelper.accessor('issues', {
        cell: info => {
          const issues = info.getValue() || [];

          // Mock issues if none exist
          const violations =
            issues.length > 0
              ? issues
              : [
                  {
                    id: 'issue-1',
                    name: 'Suspicious activity detected',
                    riskLevel: 'critical',
                  },
                  {
                    id: 'issue-2',
                    name: 'Document verification failed',
                    riskLevel: 'critical',
                  },
                  {
                    id: 'issue-3',
                    name: 'Address mismatch',
                    riskLevel: 'moderate',
                  },
                  {
                    id: 'issue-4',
                    name: 'Identity information incomplete',
                    riskLevel: 'moderate',
                  },
                  {
                    id: 'issue-5',
                    name: 'Multiple verification attempts',
                    riskLevel: 'moderate',
                  },
                ];

          return (
            <ContentTooltip
              description={
                <>
                  <p className="mb-4 text-base font-bold">Issues</p>

                  {violations.slice(0, 4).map((violation, index) => (
                    <div key={index} className="space-x-1 text-sm">
                      <WarningFilledSvg
                        className={ctw('inline-block d-5', {
                          'text-warning':
                            typeof violation === 'object' && violation.riskLevel === 'critical',
                          'text-slate-500':
                            typeof violation === 'object' &&
                            (violation.riskLevel === 'moderate' || !violation.riskLevel),
                        })}
                      />
                      <span className="text-slate-500">
                        {typeof violation === 'object' ? violation.name : violation}
                      </span>
                    </div>
                  ))}
                  {violations.length > 4 && (
                    <div className="mt-2 text-sm text-slate-500">
                      + {violations.length - 4} additional finding
                      {violations.length - 4 > 1 ? 's' : ''}
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
                    'bg-warning/20 text-warning': violations.some(
                      v => typeof v === 'object' && v.riskLevel === 'critical',
                    ),
                    'bg-slate-500/20 text-slate-500': !violations.some(
                      v => typeof v === 'object' && v.riskLevel === 'critical',
                    ),
                  },
                )}
              >
                {violations.length}
              </div>
            </ContentTooltip>
          );
        },
        header: () => <p className="text-center">Issues</p>,
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
      columnHelper.accessor('checkId', {
        cell: info => {
          const checkId = info.getValue();

          return <TextWithNAFallback>{checkId}</TextWithNAFallback>;
        },
        header: 'Check ID',
      }),
      columnHelper.accessor('status', {
        cell: ({ getValue }) => {
          const status = getValue();
          const statusToLabelMap = {
            pending: 'Pending',
            verified: 'Verified',
            rejected: 'Rejected',
          };

          return (
            <Badge
              className={ctw(`h-6 space-x-1 text-sm font-medium`, {
                'bg-[#E3E2E0]': status === 'pending',
                'bg-[#DBEDDB]': status === 'verified',
                'bg-[#ECA1A5]': status === 'rejected',
              })}
            >
              <span
                className={ctw(`rounded-full d-2`, {
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
