import { MERCHANT_REPORT_TYPES_MAP } from '@ballerine/common';
import {
  Badge,
  CheckCircle,
  ContentTooltip,
  severityToClassName,
  TextWithNAFallback,
  WarningFilledSvg,
} from '@ballerine/ui';
import { createColumnHelper } from '@tanstack/react-table';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { titleCase } from 'string-ts';

import { CopyToClipboardButton } from '@/common/components/atoms/CopyToClipboardButton/CopyToClipboardButton';
import { IndicatorCircle } from '@/common/components/atoms/IndicatorCircle/IndicatorCircle';
import { useEllipsesWithTitle } from '@/common/hooks/useEllipsesWithTitle/useEllipsesWithTitle';
import { ctw } from '@/common/utils/ctw/ctw';
import { TBusinessReport } from '@/domains/business-reports/fetchers';
import { MerchantMonitoringReportStatus } from '@/pages/MerchantMonitoring/components/MerchantMonitoringReportStatus/MerchantMonitoringReportStatus';
import { statusToData } from '@/pages/MerchantMonitoring/components/MerchantMonitoringReportStatus/MerchantMonitoringStatusBadge';
import { Minus } from 'lucide-react';
import { useMemo } from 'react';

dayjs.extend(utc);
dayjs.extend(timezone);

const columnHelper = createColumnHelper<TBusinessReport>();

const SCAN_TYPES = {
  ONBOARDING: 'Onboarding',
  MONITORING: 'Monitoring',
} as const;

const REPORT_TYPE_TO_SCAN_TYPE = {
  [MERCHANT_REPORT_TYPES_MAP.MERCHANT_REPORT_T1]: SCAN_TYPES.ONBOARDING,
  [MERCHANT_REPORT_TYPES_MAP.ONGOING_MERCHANT_REPORT_T1]: SCAN_TYPES.MONITORING,
} as const;

type MerchantMonitoringTableColumnsMeta = {
  conditional?: true;
  showColumn?: boolean;
};

export const useColumns = ({ isDemoAccount = false }) => {
  return useMemo(() => {
    const columns = [
      columnHelper.accessor('companyName', {
        cell: info => {
          const companyName = info.getValue();

          return (
            <TextWithNAFallback className={`ms-4 font-semibold`}>{companyName}</TextWithNAFallback>
          );
        },
        header: 'Company Name',
      }),
      columnHelper.accessor('website', {
        cell: info => {
          const website = info.getValue();

          return <TextWithNAFallback>{website}</TextWithNAFallback>;
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
      columnHelper.accessor('reportType', {
        cell: info => {
          const scanType = REPORT_TYPE_TO_SCAN_TYPE[info.getValue()];

          return <TextWithNAFallback>{scanType}</TextWithNAFallback>;
        },
        header: 'Scan Type',
      }),
      columnHelper.accessor('data.contentViolations', {
        cell: ({ getValue }) => {
          const violations = getValue() as NonNullable<
            TBusinessReport['data']
          >['contentViolations'];

          if (!violations?.length) {
            return null;
          }

          return (
            <ContentTooltip
              description={
                <>
                  <p className="mb-4 text-lg font-bold">Violations</p>

                  {violations.map((violation, index) => (
                    <div key={index} className="space-x-1 text-sm">
                      <WarningFilledSvg className="inline-block d-5" />
                      <span className="text-slate-500">{violation.name}</span>
                    </div>
                  ))}
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
              <div className="flex items-center justify-center rounded-full bg-warning/20 text-xs font-bold text-warning d-5">
                {violations.length}
              </div>
            </ContentTooltip>
          );
        },
        header: 'Violations',
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
          // @ts-ignore -- as per https://github.com/TanStack/table/discussions/4072, there is
          // currently no proper way to augment the meta type
          conditional: true,
          showColumn: !isDemoAccount,
        } satisfies MerchantMonitoringTableColumnsMeta,
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
      // columnHelper.accessor('merchantId', {
      //   cell: info => {
      //     // eslint-disable-next-line react-hooks/rules-of-hooks -- ESLint doesn't like `cell` not being `Cell`.
      //     const { ref, styles } = useEllipsesWithTitle<HTMLSpanElement>();
      //
      //     const id = info.getValue();
      //
      //     return (
      //       <div className={`flex w-full max-w-[12ch] items-center space-x-2`}>
      //         <TextWithNAFallback style={{ ...styles, width: '70%' }} ref={ref}>
      //           {id}
      //         </TextWithNAFallback>
      //
      //         <CopyToClipboardButton textToCopy={id ?? ''} />
      //       </div>
      //     );
      //   },
      //   header: 'Merchant ID',
      // }),
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
              reportId={info.row.original.id}
              businessId={info.row.original.business?.id}
            />
          );
        },
        header: 'Status',
      }),
    ];

    return columns.filter(column => {
      const meta = column.meta as MerchantMonitoringTableColumnsMeta | undefined;

      if (meta?.conditional) {
        return meta.showColumn;
      }

      return true;
    });
  }, [isDemoAccount]);
};
