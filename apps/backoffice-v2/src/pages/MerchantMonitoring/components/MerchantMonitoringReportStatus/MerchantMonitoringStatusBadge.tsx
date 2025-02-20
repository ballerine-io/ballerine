import { Badge } from '@ballerine/ui';
import { titleCase } from 'string-ts';
import React, { ElementRef, forwardRef } from 'react';
import { MERCHANT_REPORT_STATUSES_MAP } from '@ballerine/common';

import { ctw } from '@/common/utils/ctw/ctw';

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
  [MERCHANT_REPORT_STATUSES_MAP.completed]: {
    variant: 'success',
    title: 'Review Completed',
    text: 'The assessment of this merchant is finalized',
  },
} as const;

export const MerchantMonitoringStatusBadge = forwardRef<
  ElementRef<typeof Badge>,
  { status: keyof typeof statusToData; disabled?: boolean }
>(({ status, disabled = false, ...props }, ref) => {
  const isReportInProgress = [
    MERCHANT_REPORT_STATUSES_MAP['in-progress'],
    MERCHANT_REPORT_STATUSES_MAP['quality-control'],
  ].includes(status);

  return (
    <Badge
      {...props}
      ref={ref}
      variant={statusToData[status].variant}
      className={ctw(`h-6 cursor-pointer space-x-1 text-sm font-medium`, {
        'cursor-not-allowed': disabled,
        'hover:shadow-[0_0_2px_rgba(0,0,0,0.3)]': !disabled,
        'cursor-not-allowed bg-[#E3E2E0] text-[#32302C]/40 ': isReportInProgress,
        'bg-[#E3E2E0] text-[#32302C]': status === MERCHANT_REPORT_STATUSES_MAP['pending-review'],
        'text-[#32302C]/40': status === MERCHANT_REPORT_STATUSES_MAP['pending-review'] && disabled,
        'bg-[#D3E5EF] text-[#183347]': status === MERCHANT_REPORT_STATUSES_MAP['under-review'],
        'text-[#183347]/40': status === MERCHANT_REPORT_STATUSES_MAP['under-review'] && disabled,
        'bg-[#DBEDDB] text-[#1C3829]': status === MERCHANT_REPORT_STATUSES_MAP['completed'],
        'text-[#1C3829]/40': status === MERCHANT_REPORT_STATUSES_MAP['completed'] && disabled,
      })}
    >
      <span
        className={ctw(`rounded-full d-2`, {
          'bg-[#91918E]':
            isReportInProgress || status === MERCHANT_REPORT_STATUSES_MAP['pending-review'],
          'bg-[#5B97BD]': status === MERCHANT_REPORT_STATUSES_MAP['under-review'],
          'bg-[#6C9B7D]': status === MERCHANT_REPORT_STATUSES_MAP['completed'],
        })}
      >
        &nbsp;
      </span>
      <span>{statusToData[status].title ?? titleCase(status ?? '')}</span>
    </Badge>
  );
});

MerchantMonitoringStatusBadge.displayName = 'MerchantMonitoringStatusBadge';
