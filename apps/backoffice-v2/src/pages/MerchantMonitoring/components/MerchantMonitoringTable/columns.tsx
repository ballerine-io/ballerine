import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

// Add these plugins to dayjs
dayjs.extend(utc);
dayjs.extend(timezone);

import { createColumnHelper } from '@tanstack/react-table';
import { BusinessReportStatus, TBusinessReport } from '@/domains/business-reports/fetchers';
import { titleCase } from 'string-ts';

import { ctw } from '@/common/utils/ctw/ctw';
import { getSeverityFromRiskScore, isObject } from '@ballerine/common';
import { Badge, severityToClassName, TextWithNAFallback, WarningFilledSvg } from '@ballerine/ui';
import { useEllipsesWithTitle } from '@/common/hooks/useEllipsesWithTitle/useEllipsesWithTitle';
import { CopyToClipboardButton } from '@/common/components/atoms/CopyToClipboardButton/CopyToClipboardButton';
import { Minus } from 'lucide-react';

const columnHelper = createColumnHelper<TBusinessReport>();

const SCAN_TYPES = {
  ONBOARDING: 'Onboarding',
  MONITORING: 'Monitoring',
};

const REPORT_TYPE_TO_SCAN_TYPE = {
  MERCHANT_REPORT_T1: SCAN_TYPES.ONBOARDING,
  ONGOING_MERCHANT_REPORT_T1: SCAN_TYPES.MONITORING,
};

export const columns = [
  columnHelper.accessor('report', {
    cell: info => {
      const summary = info.getValue()?.data?.summary;

      const isAlert = isObject(summary) && 'isAlert' in summary && summary.isAlert;

      return isAlert ? (
        <WarningFilledSvg className={`ms-4 d-6`} />
      ) : (
        <Minus className={`ms-4 text-[#D9D9D9] d-6`} />
      );
    },
    header: 'Alert',
  }),
  columnHelper.accessor('type', {
    cell: info => {
      const scanType =
        REPORT_TYPE_TO_SCAN_TYPE[info.getValue() as keyof typeof REPORT_TYPE_TO_SCAN_TYPE];

      return <TextWithNAFallback>{scanType}</TextWithNAFallback>;
    },
    header: 'Scan Type',
  }),
  columnHelper.accessor('createdAt', {
    cell: info => {
      const createdAt = info.getValue();

      if (!createdAt) {
        return <TextWithNAFallback>{createdAt}</TextWithNAFallback>;
      }

      // Convert UTC time to local browser time
      const localDateTime = dayjs.utc(createdAt).local();

      const date = localDateTime.format('MMM DD, YYYY');
      const time = localDateTime.format('HH:mm');

      return (
        <div className={`flex flex-col space-y-0.5`}>
          <span className={`font-semibold`}>{date}</span>
          <span className={`text-xs text-[#999999]`}>{time}</span>
        </div>
      );
    },
    header: 'Created At',
  }),
  columnHelper.accessor('business.id', {
    cell: info => {
      // eslint-disable-next-line react-hooks/rules-of-hooks -- ESLint doesn't like `cell` not being `Cell`.
      const { ref, styles } = useEllipsesWithTitle<HTMLSpanElement>();

      const id = info.getValue();

      return (
        <div className={`ml-[10px] flex w-full max-w-[12ch] items-center space-x-2`}>
          <TextWithNAFallback style={{ ...styles, width: '70%' }} ref={ref}>
            {id}
          </TextWithNAFallback>

          <CopyToClipboardButton textToCopy={id ?? ''} />
        </div>
      );
    },
    header: 'Merchant ID',
  }),
  columnHelper.accessor('id', {
    cell: info => {
      // eslint-disable-next-line react-hooks/rules-of-hooks -- ESLint doesn't like `cell` not being `Cell`.
      const { ref, styles } = useEllipsesWithTitle<HTMLSpanElement>();

      const id = info.getValue();

      return (
        <div className={`ml-[10px] flex w-full max-w-[12ch] items-center space-x-2`}>
          <TextWithNAFallback style={{ ...styles, width: '70%' }} ref={ref}>
            {id}
          </TextWithNAFallback>

          <CopyToClipboardButton textToCopy={id ?? ''} />
        </div>
      );
    },
    header: 'Report ID',
  }),
  columnHelper.accessor('website', {
    cell: info => {
      const website = info.getValue();

      return <TextWithNAFallback>{website}</TextWithNAFallback>;
    },
    header: 'Website',
  }),
  columnHelper.accessor('companyName', {
    cell: info => {
      const companyName = info.getValue();

      return <TextWithNAFallback>{companyName}</TextWithNAFallback>;
    },
    header: 'Company Name',
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
    header: 'Risk Score',
  }),
  columnHelper.accessor('status', {
    cell: info => {
      const status = info.getValue();
      const statusToDisplayStatus = {
        [BusinessReportStatus.COMPLETED]: 'Manual Review',
      } as const;

      return (
        <TextWithNAFallback
          className={ctw('font-semibold', {
            'text-slate-400': status === BusinessReportStatus.COMPLETED,
          })}
        >
          {titleCase(statusToDisplayStatus[status as keyof typeof statusToDisplayStatus] ?? status)}
        </TextWithNAFallback>
      );
    },
    header: 'Status',
  }),
];
