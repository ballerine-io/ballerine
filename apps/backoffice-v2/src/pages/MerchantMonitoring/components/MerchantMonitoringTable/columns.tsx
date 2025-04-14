import { MERCHANT_REPORT_TYPES_MAP } from '@ballerine/common';
import {
  Badge,
  CheckCircle,
  ContentTooltip,
  severityToClassName,
  TextWithNAFallback,
  WarningFilledSvg,
} from '@ballerine/ui';
import { createColumnHelper, RowData } from '@tanstack/react-table';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { Minus } from 'lucide-react';
import { useMemo } from 'react';
import { titleCase } from 'string-ts';

import { CopyToClipboardButton } from '@/common/components/atoms/CopyToClipboardButton/CopyToClipboardButton';
import { IndicatorCircle } from '@/common/components/atoms/IndicatorCircle/IndicatorCircle';
import {
  NO_VIOLATION_DETECTED_RISK_INDICATOR_ID,
  POSITIVE_RISK_LEVEL_ID,
} from '@/common/constants';
import { useEllipsesWithTitle } from '@/common/hooks/useEllipsesWithTitle/useEllipsesWithTitle';
import { ctw } from '@/common/utils/ctw/ctw';
import { TBusinessReport } from '@/domains/business-reports/fetchers';
import { MerchantMonitoringReportStatus } from '@/pages/MerchantMonitoring/components/MerchantMonitoringReportStatus/MerchantMonitoringReportStatus';
import { statusToData } from '@/pages/MerchantMonitoring/components/MerchantMonitoringReportStatus/MerchantMonitoringStatusBadge';
import { uniqBy } from 'lodash-es';

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
      columnHelper.accessor('website', {
        cell: ({ getValue }) => {
          const website = getValue()
            .replace(/(^\w+:|^)\/\//, '')
            .replace(/\/$/, '');

          return (
            <TextWithNAFallback className="inline-block w-32 truncate">
              {website}
            </TextWithNAFallback>
          );
        },
        header: 'Website',
      }),
      columnHelper.accessor('riskLevel', {
        cell: info => {
          const riskLevel = info.getValue();

          return (
            <div className="mx-auto flex items-center justify-center gap-2">
              {riskLevel ? (
                <Badge className={ctw(severityToClassName[riskLevel], 'w-20 py-0.5 font-bold')}>
                  {titleCase(riskLevel)}
                </Badge>
              ) : (
                <TextWithNAFallback className={'py-0.5'} />
              )}
            </div>
          );
        },
        header: () => <p className="text-center">Risk Level</p>,
      }),
      columnHelper.accessor('data.allViolations', {
        cell: ({ row }) => {
          let violations = (row.original.data?.allViolations ?? [])
            .filter(
              violation =>
                violation.id !== NO_VIOLATION_DETECTED_RISK_INDICATOR_ID &&
                violation.name &&
                violation.riskLevel &&
                violation.riskLevel !== POSITIVE_RISK_LEVEL_ID,
            )
            .sort((a, b) => {
              return a.riskLevel === b.riskLevel
                ? (a.name ?? '').localeCompare(b.name ?? '')
                : (a.riskLevel ?? '').localeCompare(b.riskLevel ?? '');
            });

          violations = uniqBy(violations, 'id');

          if (!violations?.length) {
            return null;
          }

          return (
            <ContentTooltip
              description={
                <>
                  <p className="mb-4 text-base font-bold">Findings</p>

                  {violations.slice(0, 4).map((violation, index) => (
                    <div key={index} className="space-x-1 text-sm">
                      <WarningFilledSvg
                        className={ctw('inline-block d-5', {
                          'text-warning': violation.riskLevel === 'critical',
                          'text-slate-500':
                            violation.riskLevel === 'moderate' || !violation.riskLevel,
                        })}
                      />
                      <span className="text-slate-500">{violation.name}</span>
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
                    'bg-warning/20 text-warning': violations.some(v => v.riskLevel === 'critical'),
                    'bg-slate-500/20 text-slate-500': !violations.some(
                      v => v.riskLevel === 'critical',
                    ),
                  },
                )}
              >
                {violations.length}
              </div>
            </ContentTooltip>
          );
        },
        header: 'Findings',
      }),
      columnHelper.accessor('reportType', {
        cell: info => {
          const scanType = REPORT_TYPE_TO_SCAN_TYPE[info.getValue()];

          return <TextWithNAFallback>{scanType}</TextWithNAFallback>;
        },
        header: 'Scan Type',
      }),
      columnHelper.accessor('monitoringStatus', {
        cell: ({ getValue }) => {
          const value = getValue();

          return (
            <ContentTooltip
              description={
                <p>This merchant is {!value && 'not '}subscribed to recurring ongoing monitoring</p>
              }
              props={{
                tooltipTrigger: { className: 'flex w-full justify-start' },
                tooltipContent: { align: 'center', side: 'top' },
              }}
            >
              <div className="mx-auto">
                {value ? (
                  <CheckCircle
                    size={18}
                    className={`stroke-background`}
                    containerProps={{
                      className: 'bg-success',
                    }}
                  />
                ) : (
                  <IndicatorCircle
                    size={18}
                    className={`stroke-transparent`}
                    containerProps={{
                      className: 'bg-slate-500/20',
                    }}
                  />
                )}
              </div>
            </ContentTooltip>
          );
        },
        header: () => (
          <ContentTooltip
            description={<p>Indicates whether the merchant is subscribed to ongoing monitoring</p>}
            props={{
              tooltipTrigger: { className: 'mx-auto' },
              tooltipContent: { align: 'center', side: 'top' },
            }}
          >
            <span className={`max-w-[20ch] truncate text-sm`}>Monitored</span>
          </ContentTooltip>
        ),
      }),
      columnHelper.accessor('isAlert', {
        cell: ({ getValue }) => {
          return getValue() ? (
            <WarningFilledSvg className={`mx-auto d-6`} />
          ) : (
            <Minus className={`mx-auto text-[#D9D9D9] d-6`} />
          );
        },
        header: () => <p className="text-center">Alert</p>,
        meta: {
          conditional: true,
          showColumn: !isDemoAccount,
        },
      }),
      columnHelper.accessor('displayDate', {
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
      columnHelper.accessor('id', {
        cell: info => {
          // eslint-disable-next-line react-hooks/rules-of-hooks -- ESLint doesn't like `cell` not being `Cell`.
          const { ref, styles } = useEllipsesWithTitle<HTMLSpanElement>();

          const id = info.getValue();

          return (
            <div className={`flex w-full max-w-[12ch] items-center space-x-2`}>
              <TextWithNAFallback style={{ ...styles, width: '70%' }} ref={ref}>
                {id}
              </TextWithNAFallback>

              <CopyToClipboardButton textToCopy={id ?? ''} />
            </div>
          );
        },
        header: 'Report ID',
      }),
      columnHelper.accessor('business.correlationId', {
        cell: info => {
          // eslint-disable-next-line react-hooks/rules-of-hooks -- ESLint doesn't like `cell` not being `Cell`.
          const { ref, styles } = useEllipsesWithTitle<HTMLSpanElement>();
          const merchantId = info.getValue() ?? info.row.original.business?.id;

          return (
            <div className={`flex w-full max-w-[12ch] items-center space-x-2`}>
              <TextWithNAFallback style={{ ...styles, width: '70%' }} ref={ref}>
                {merchantId}
              </TextWithNAFallback>

              <CopyToClipboardButton textToCopy={merchantId ?? ''} />
            </div>
          );
        },
        header: 'Merchant ID',
      }),
      columnHelper.accessor('status', {
        meta: {
          useWrapper: true,
        },
        cell: info => {
          const status = info.getValue() as keyof typeof statusToData;

          return (
            <MerchantMonitoringReportStatus
              status={status}
              className="pr-1"
              reportId={info.row.original.id}
              businessId={info.row.original.business?.id}
            />
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
