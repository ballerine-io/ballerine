import { Badge } from '@ballerine/ui';
import { titleCase } from 'string-ts';
import { MERCHANT_REPORT_STATUSES_MAP } from '@ballerine/common';

import { ctw } from '@/common/utils/ctw/ctw';
import { useEllipsesWithTitle } from '@/common/hooks/useEllipsesWithTitle/useEllipsesWithTitle';

export const statusToData = {
  [MERCHANT_REPORT_STATUSES_MAP['in-progress']]: {
    variant: 'gray',
    title: 'Case in progress',
    text: '',
  },
  [MERCHANT_REPORT_STATUSES_MAP['quality-control']]: {
    variant: 'gray',
    title: 'Case in progress',
    text: '',
  },
  [MERCHANT_REPORT_STATUSES_MAP['pending-review']]: {
    variant: 'gray',
    title: 'Pending Review',
  },
  [MERCHANT_REPORT_STATUSES_MAP['under-review']]: {
    variant: 'info',
    title: 'Under Review',
  },
  [MERCHANT_REPORT_STATUSES_MAP['conditionally-approved']]: {
    variant: 'warning',
    title: 'Conditionally Approved',
  },
  [MERCHANT_REPORT_STATUSES_MAP['cleared']]: {
    variant: 'success',
    title: 'Approved',
  },
  [MERCHANT_REPORT_STATUSES_MAP['terminated']]: {
    variant: 'destructive',
    title: 'Rejected',
  },
  [MERCHANT_REPORT_STATUSES_MAP['completed']]: {
    variant: 'success',
    title: 'Completed',
  },
  [MERCHANT_REPORT_STATUSES_MAP['failed']]: {
    variant: 'destructive',
    title: 'Failed',
  },
} as const;

export const KybAndUboCheckStatusBadge = ({
  status,
  disabled = false,
  ...props
}: {
  status: keyof typeof statusToData;
  disabled?: boolean;
}) => {
  const isReportInProgress = [
    MERCHANT_REPORT_STATUSES_MAP['in-progress'],
    MERCHANT_REPORT_STATUSES_MAP['quality-control'],
  ].includes(status);

  const { ref, styles } = useEllipsesWithTitle<HTMLSpanElement>();

  return (
    <Badge
      {...props}
      variant={statusToData[status]?.variant}
      className={ctw(`h-6 space-x-1 text-sm font-medium`, {
        '!cursor-not-allowed': disabled,
        ' bg-[#E3E2E0] text-[#32302C]/40 ': isReportInProgress,
        'cursor-pointer hover:shadow-[0_0_2px_rgba(0,0,0,0.3)]': !disabled,
        'bg-[#E3E2E0] text-[#32302C]': status === MERCHANT_REPORT_STATUSES_MAP['pending-review'],
        'text-[#32302C]/40': status === MERCHANT_REPORT_STATUSES_MAP['pending-review'] && disabled,
        'bg-[#D3E5EF] text-[#183347]': status === MERCHANT_REPORT_STATUSES_MAP['under-review'],
        'text-[#183347]/40': status === MERCHANT_REPORT_STATUSES_MAP['under-review'] && disabled,
        'bg-[#DBEDDB] text-[#1C3829]':
          status === MERCHANT_REPORT_STATUSES_MAP['cleared'] ||
          status === MERCHANT_REPORT_STATUSES_MAP['completed'],
        'bg-[#F4D8B9] text-[#183347]':
          status === MERCHANT_REPORT_STATUSES_MAP['conditionally-approved'],
        'bg-[#ECA1A5] text-[#32302C]':
          status === MERCHANT_REPORT_STATUSES_MAP['terminated'] ||
          status === MERCHANT_REPORT_STATUSES_MAP['failed'],
      })}
    >
      <span
        className={ctw(`rounded-full d-2`, {
          'bg-[#91918E]':
            isReportInProgress || status === MERCHANT_REPORT_STATUSES_MAP['pending-review'],
          'bg-[#5B97BD]': status === MERCHANT_REPORT_STATUSES_MAP['under-review'],
          'bg-[#6C9B7D]':
            status === MERCHANT_REPORT_STATUSES_MAP['cleared'] ||
            status === MERCHANT_REPORT_STATUSES_MAP['completed'],
          'bg-[#F4AA52]': status === MERCHANT_REPORT_STATUSES_MAP['conditionally-approved'],
          'bg-[#DF2222]':
            status === MERCHANT_REPORT_STATUSES_MAP['terminated'] ||
            status === MERCHANT_REPORT_STATUSES_MAP['failed'],
        })}
      >
        &nbsp;
      </span>
      <span ref={ref} style={{ ...styles, width: '100%' }}>
        {statusToData[status]?.title ?? titleCase(status ?? '')}
      </span>
    </Badge>
  );
};

KybAndUboCheckStatusBadge.displayName = 'KybAndUboCheckStatusBadge';
