import { ctw } from '@ballerine/ui';
import { ComponentProps } from 'react';

import { Button } from '@/common/components/atoms/Button/Button';
import {
  statusToData,
  MerchantMonitoringStatusBadge,
} from '@/pages/MerchantMonitoring/components/MerchantMonitoringReportStatus/MerchantMonitoringStatusBadge';

export const MerchantMonitoringStatusButton = ({
  status,
  onClick,
  disabled = false,
}: ComponentProps<typeof Button> & { disabled?: boolean; status: keyof typeof statusToData }) => (
  <Button
    type={`button`}
    onClick={e => {
      e.stopPropagation();

      if (disabled) {
        return;
      }

      onClick?.(e);
    }}
    variant={'status'}
    className={ctw(`flex h-16  w-full flex-col items-start justify-center space-y-1 px-4 py-2`, {
      '!cursor-not-allowed': disabled,
    })}
  >
    <MerchantMonitoringStatusBadge status={status} disabled={disabled} />
    <span className={`text-start text-xs font-semibold leading-5 text-[#94A3B8]`}>
      {statusToData[status].text}
    </span>
  </Button>
);
