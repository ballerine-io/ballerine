import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

// Add these plugins to dayjs
dayjs.extend(utc);
dayjs.extend(timezone);

import { TBusinessReport } from '@/domains/business-reports/fetchers';
import { createColumnHelper } from '@tanstack/react-table';
import { titleCase } from 'string-ts';

import { CopyToClipboardButton } from '@/common/components/atoms/CopyToClipboardButton/CopyToClipboardButton';
import { IndicatorCircle } from '@/common/components/atoms/IndicatorCircle/IndicatorCircle';
import { useEllipsesWithTitle } from '@/common/hooks/useEllipsesWithTitle/useEllipsesWithTitle';
import { ctw } from '@/common/utils/ctw/ctw';
import {
  MERCHANT_REPORT_STATUSES_MAP,
  MERCHANT_REPORT_TYPES_MAP,
} from '@/domains/business-reports/constants';
import { getSeverityFromRiskScore } from '@ballerine/common';
import {
  Badge,
  CheckCircle,
  ContentTooltip,
  severityToClassName,
  TextWithNAFallback,
  WarningFilledSvg,
} from '@ballerine/ui';
import { Minus } from 'lucide-react';

const columnHelper = createColumnHelper<TBusinessReport>();

const SCAN_TYPES = {
  ONBOARDING: 'Onboarding',
  MONITORING: 'Monitoring',
} as const;

const REPORT_STATUS_TO_DISPLAY_STATUS = {
  [MERCHANT_REPORT_STATUSES_MAP.completed]: 'Ready for Review',
  [MERCHANT_REPORT_STATUSES_MAP['quality-control']]: 'Quality Control',
} as const;

const REPORT_TYPE_TO_SCAN_TYPE = {
  [MERCHANT_REPORT_TYPES_MAP.MERCHANT_REPORT_T1]: SCAN_TYPES.ONBOARDING,
  [MERCHANT_REPORT_TYPES_MAP.ONGOING_MERCHANT_REPORT_T1]: SCAN_TYPES.MONITORING,
} as const;

export const columns = [
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
  columnHelper.accessor('riskScore', {
    cell: info => {
      const riskScore = info.getValue();
      const severity = getSeverityFromRiskScore(riskScore);

      return (
        <div className="flex items-center gap-2">
          {!riskScore && riskScore !== 0 && <TextWithNAFallback className={'py-0.5'} />}
          {(riskScore || riskScore === 0) && (
            <Badge
              className={ctw(
                severityToClassName[
                  (severity?.toUpperCase() as keyof typeof severityToClassName) ?? 'DEFAULT'
                ],
                'w-20 py-0.5 font-bold',
              )}
            >
              {titleCase(severity ?? '')}
            </Badge>
          )}
        </div>
      );
    },
    header: 'Risk Level',
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
            tooltipTrigger: { className: 'flex w-full justify-center' },
            tooltipContent: { align: 'center', side: 'top' },
          }}
        >
          {value ? (
            <CheckCircle
              size={18}
              className={`stroke-background`}
              containerProps={{
                className: 'me-3 bg-success mt-px',
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
        </ContentTooltip>
      );
    },
    header: () => (
      <ContentTooltip
        description={<p>Indicates whether the merchant is subscribed to ongoing monitoring</p>}
        props={{
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
  columnHelper.accessor('isAlert', {
    cell: ({ getValue }) => {
      return getValue() ? (
        <WarningFilledSvg className={`d-6`} />
      ) : (
        <Minus className={`text-[#D9D9D9] d-6`} />
      );
    },
    header: 'Alert',
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
  columnHelper.accessor('status', {
    cell: info => {
      const status = info.getValue();

      return (
        <TextWithNAFallback
          className={ctw('font-semibold', {
            'text-slate-400': status === MERCHANT_REPORT_STATUSES_MAP.completed,
            'text-destructive': status === MERCHANT_REPORT_STATUSES_MAP.failed,
          })}
        >
          {titleCase(
            REPORT_STATUS_TO_DISPLAY_STATUS[
              status as keyof typeof REPORT_STATUS_TO_DISPLAY_STATUS
            ] ?? status,
          )}
        </TextWithNAFallback>
      );
    },
    header: 'Status',
  }),
];
