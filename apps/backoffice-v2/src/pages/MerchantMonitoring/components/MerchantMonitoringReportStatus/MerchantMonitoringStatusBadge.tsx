import { Badge } from '@ballerine/ui';
import { titleCase } from 'string-ts';
import { MERCHANT_REPORT_STATUSES_MAP } from '@ballerine/common';

import { ctw } from '@/common/utils/ctw/ctw';
import { useEllipsesWithTitle } from '@/common/hooks/useEllipsesWithTitle/useEllipsesWithTitle';
import { captureSentryError } from '@/sentry/capture-exception';

const reportInProgressData = {
  variant: 'gray',
  title: 'Scan in progress',
  text: '',
};

export const statusToData = {
  [MERCHANT_REPORT_STATUSES_MAP['in-progress']]: reportInProgressData,
  [MERCHANT_REPORT_STATUSES_MAP['quality-control']]: reportInProgressData,
  [MERCHANT_REPORT_STATUSES_MAP['pending-review']]: {
    variant: 'gray',
    title: 'Pending Review',
    text: 'The review process has not yet started',
  },
  [MERCHANT_REPORT_STATUSES_MAP['under-review']]: {
    variant: 'info',
    title: 'Under Review',
    text: 'The merchant is currently being assessed',
  },
  [MERCHANT_REPORT_STATUSES_MAP['conditionally-approved']]: {
    variant: 'warning',
    title: 'Conditionally Approved',
    text: 'Merchant reviewed with minor or borderline issues',
  },
  [MERCHANT_REPORT_STATUSES_MAP['cleared']]: {
    variant: 'success',
    title: 'Cleared',
    text: 'Merchant reviewed and found compliant or low risk',
  },
  [MERCHANT_REPORT_STATUSES_MAP['terminated']]: {
    variant: 'destructive',
    title: 'Terminated',
    text: 'Merchant reviewed and confirmed non-compliant or high risk',
  },
} as const;

export const MerchantMonitoringStatusBadge = ({
  status,
  disabled = false,
  ...props
}: {
  status: keyof typeof statusToData;
  disabled?: boolean;
}) => {
  // TODO: Can be removed when we get rid of records that have this status
  if ((status as string) === MERCHANT_REPORT_STATUSES_MAP['completed']) {
    status = MERCHANT_REPORT_STATUSES_MAP['conditionally-approved'];
  }

  if (!statusToData[status]) {
    captureSentryError(
      new Error(`MerchantMonitoringStatusBadge: status "${status}" not found in statusToData.`),
      { componentName: 'MerchantMonitoringStatusBadge' },
    );
    return null;
  }

  const isReportInProgress = [
    MERCHANT_REPORT_STATUSES_MAP['in-progress'],
    MERCHANT_REPORT_STATUSES_MAP['quality-control'],
  ].includes(status);

  const { ref, styles } = useEllipsesWithTitle<HTMLSpanElement>();

  return (
    <Badge
      {...props}
      variant={statusToData[status].variant}
      className={ctw(`h-6 space-x-1 text-sm font-medium`, {
        '!cursor-not-allowed': disabled,
        ' bg-[#E3E2E0] text-[#32302C]/40 ': isReportInProgress,
        'cursor-pointer hover:shadow-[0_0_2px_rgba(0,0,0,0.3)]': !disabled,
        'bg-[#E3E2E0] text-[#32302C]': status === MERCHANT_REPORT_STATUSES_MAP['pending-review'],
        'text-[#32302C]/40': status === MERCHANT_REPORT_STATUSES_MAP['pending-review'] && disabled,
        'bg-[#D3E5EF] text-[#183347]': status === MERCHANT_REPORT_STATUSES_MAP['under-review'],
        'text-[#183347]/40': status === MERCHANT_REPORT_STATUSES_MAP['under-review'] && disabled,
        'bg-[#DBEDDB] text-[#1C3829]': status === MERCHANT_REPORT_STATUSES_MAP['cleared'],
        'bg-[#F4D8B9] text-[#183347]':
          status === MERCHANT_REPORT_STATUSES_MAP['conditionally-approved'],
        'bg-[#ECA1A5] text-[#32302C]': status === MERCHANT_REPORT_STATUSES_MAP['terminated'],
      })}
    >
      <span
        className={ctw(`rounded-full d-2`, {
          'bg-[#91918E]':
            isReportInProgress || status === MERCHANT_REPORT_STATUSES_MAP['pending-review'],
          'bg-[#5B97BD]': status === MERCHANT_REPORT_STATUSES_MAP['under-review'],
          'bg-[#6C9B7D]': status === MERCHANT_REPORT_STATUSES_MAP['cleared'],
          'bg-[#F4AA52]': status === MERCHANT_REPORT_STATUSES_MAP['conditionally-approved'],
          'bg-[#DF2222]': status === MERCHANT_REPORT_STATUSES_MAP['terminated'],
        })}
      >
        &nbsp;
      </span>
      <span ref={ref} style={{ ...styles, width: '100%' }}>
        {statusToData[status].title ?? titleCase(status ?? '')}
      </span>
    </Badge>
  );
};

MerchantMonitoringStatusBadge.displayName = 'MerchantMonitoringStatusBadge';
