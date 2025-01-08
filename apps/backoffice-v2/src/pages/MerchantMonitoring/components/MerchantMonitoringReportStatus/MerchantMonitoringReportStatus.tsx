import { titleCase } from 'string-ts';
import React, { ElementRef, forwardRef } from 'react';
import {
  Badge,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@ballerine/ui';

import { ctw } from '@/common/utils/ctw/ctw';
import { Button } from '@/common/components/atoms/Button/Button';
import { MERCHANT_REPORT_STATUSES_MAP } from '@/domains/business-reports/constants';

const reportInProgressData = {
  variant: 'gray',
  title: 'Scan in progress',
  text: '',
};
const statusToData = {
  [MERCHANT_REPORT_STATUSES_MAP['in-progress']]: reportInProgressData,
  [MERCHANT_REPORT_STATUSES_MAP['quality-control']]: reportInProgressData,
  // [MERCHANT_REPORT_STATUSES_MAP['pending-review']]: {
  //   variant: 'gray',
  //   title: 'Pending Review',
  //   text: 'The review process has not yet started',
  // },
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

const statusesToSelect = [
  // MERCHANT_REPORT_STATUSES_MAP['pending-review'],
  MERCHANT_REPORT_STATUSES_MAP['under-review'],
  MERCHANT_REPORT_STATUSES_MAP.completed,
];

const BadgeElement = forwardRef<ElementRef<typeof Badge>, { status: keyof typeof statusToData }>(
  ({ status, ...props }, ref) => {
    const reportIsInProgress = [
      MERCHANT_REPORT_STATUSES_MAP['in-progress'],
      MERCHANT_REPORT_STATUSES_MAP['quality-control'],
    ].includes(status);

    return (
      <Badge
        {...props}
        ref={ref}
        variant={statusToData[status].variant}
        className={ctw(`h-6 space-x-1 text-sm font-medium hover:shadow-[0_0_2px_rgba(0,0,0,0.3)]`, {
          'cursor-pointer': !reportIsInProgress,
          'cursor-not-allowed bg-[#E3E2E0] text-[#32302C]/60 ': reportIsInProgress,
          'bg-[#D3E5EF] text-[#183347]': status === MERCHANT_REPORT_STATUSES_MAP['under-review'],
          'bg-[#DBEDDB] text-[#1C3829]': status === MERCHANT_REPORT_STATUSES_MAP['completed'],
        })}
      >
        <span
          className={ctw(`rounded-full d-2`, {
            'bg-[#91918E]': reportIsInProgress,
            'bg-[#5B97BD]': status === MERCHANT_REPORT_STATUSES_MAP['under-review'],
            'bg-[#6C9B7D]': status === MERCHANT_REPORT_STATUSES_MAP['completed'],
          })}
        >
          &nbsp;
        </span>
        <span>{statusToData[status].title ?? titleCase(status ?? '')}</span>
      </Badge>
    );
  },
);

BadgeElement.displayName = 'BadgeElement';

export const MerchantMonitoringReportStatus = ({
  status,
}: {
  status?: keyof typeof statusToData;
}) => {
  if (!status) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={`flex items-center`}
        disabled={[
          MERCHANT_REPORT_STATUSES_MAP['in-progress'],
          MERCHANT_REPORT_STATUSES_MAP['quality-control'],
        ].includes(status)}
      >
        <BadgeElement status={status} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className={`space-y-2 p-4`}>
        {statusesToSelect.map(status => (
          <DropdownMenuItem
            key={status}
            className="flex w-full cursor-pointer items-center px-8 py-1"
            asChild
          >
            <Button
              variant={'status'}
              className="flex h-16 w-80 flex-col items-start justify-center space-y-1 px-4 py-2"
              onClick={() => {
                console.log(status);
              }}
            >
              <BadgeElement status={status} />
              <span className={`text-xs font-semibold leading-5 text-[#94A3B8]`}>
                {statusToData[status].text}
              </span>
            </Button>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
