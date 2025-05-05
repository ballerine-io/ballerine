import { TKybAndUbosCheck } from '@/domains/kyb-and-ubos/fetchers';
import { MERCHANT_REPORT_TYPES_MAP } from '@ballerine/common';
import {
  Badge,
  ctw,
  ContentTooltip,
  severityToClassName,
  WarningFilledSvg,
  TextWithNAFallback,
} from '@ballerine/ui';
import { createColumnHelper, RowData } from '@tanstack/react-table';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { useMemo } from 'react';
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

const columnHelper = createColumnHelper<TKybAndUbosCheck>();

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
      columnHelper.accessor('companyName', {
        cell: info => {
          const companyName = info.getValue();
          const isExample = info.row.original.isExample;

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
      columnHelper.accessor('registrationNumber', {
        cell: info => {
          const registrationNumber = info.getValue();

          return (
            <TextWithNAFallback className="font-semibold">{registrationNumber}</TextWithNAFallback>
          );
        },
        header: 'Registration Number',
      }),
      columnHelper.accessor('country', {
        cell: info => {
          const country = info.getValue();
          const state = info.row.original.state;

          return (
            <div className="flex flex-col">
              <TextWithNAFallback className="font-semibold">{country}</TextWithNAFallback>
              {state && <span className="text-xs text-[#999999]">{state}</span>}
            </div>
          );
        },
        header: 'Country/State',
      }),
      columnHelper.accessor('merchantId', {
        cell: info => {
          const merchantId = info.getValue();

          return <TextWithNAFallback className="font-semibold">{merchantId}</TextWithNAFallback>;
        },
        header: 'Merchant ID',
      }),
      columnHelper.accessor('riskLevel', {
        cell: info => {
          const riskLevel = info.getValue();

          return (
            <Badge className={`rounded-[5px] px-2 text-xs ${severityToClassName[riskLevel]}`}>
              {riskLevel}
            </Badge>
          );
        },
        header: 'Risk Level',
      }),
      columnHelper.accessor('findings', {
        cell: info => {
          const findings = info.getValue() || [];

          // Mock findings if none exist
          const violations =
            findings.length > 0
              ? findings
              : [
                  {
                    id: 'finding-1',
                    name: 'Suspicious business activity',
                    riskLevel: 'high',
                  },
                  {
                    id: 'finding-2',
                    name: 'Incomplete company documentation',
                    riskLevel: 'high',
                  },
                  {
                    id: 'finding-3',
                    name: 'Beneficial owner verification failed',
                    riskLevel: 'medium',
                  },
                  {
                    id: 'finding-4',
                    name: 'Company address mismatch',
                    riskLevel: 'medium',
                  },
                  {
                    id: 'finding-5',
                    name: 'Unusual corporate structure',
                    riskLevel: 'medium',
                  },
                ];

          return (
            <ContentTooltip
              description={
                <>
                  <p className="mb-4 text-base font-bold">Findings</p>

                  {violations.slice(0, 4).map((violation, index) => (
                    <div key={index} className="space-x-1 text-sm">
                      <WarningFilledSvg
                        className={ctw('inline-block d-5', {
                          'text-warning':
                            typeof violation === 'object' && violation.riskLevel === 'high',
                          'text-slate-500':
                            typeof violation === 'object' &&
                            (violation.riskLevel === 'medium' || !violation.riskLevel),
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
                      v => typeof v === 'object' && v.riskLevel === 'high',
                    ),
                    'bg-slate-500/20 text-slate-500': !violations.some(
                      v => typeof v === 'object' && v.riskLevel === 'high',
                    ),
                  },
                )}
              >
                {violations.length}
              </div>
            </ContentTooltip>
          );
        },
        header: () => <p className="text-center">Findings</p>,
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
          const statusToLabelMap = {
            pending: 'Pending',
            approved: 'Verified',
            rejected: 'Rejected',
            'in-progress': 'Case In Progress',
          };

          return (
            <Badge
              className={ctw(`h-6 w-[80%] space-x-1 text-sm font-medium`, {
                'bg-[#E3E2E0]': status === 'pending' || status === 'in-progress',
                'bg-[#DBEDDB]': status === 'approved',
                'bg-[#ECA1A5]': status === 'rejected',
              })}
            >
              <span
                className={ctw(`rounded-full d-2`, {
                  'bg-[#91918E]': status === 'pending' || status === 'in-progress',
                  'bg-[#6C9B7D]': status === 'approved',
                  'bg-[#DF2222]': status === 'rejected',
                  'opacity-50': status === 'in-progress',
                })}
              >
                &nbsp;
              </span>
              <span
                style={{ width: '100%' }}
                className={ctw('text-sm', {
                  'text-[#32302C]': status === 'pending' || status === 'in-progress',
                  'text-[#1C3829]': status === 'approved' || status === 'rejected',
                  'opacity-50': status === 'in-progress',
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
