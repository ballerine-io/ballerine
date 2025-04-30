import { useCallback, useState } from 'react';
import { UpdateableReportStatus } from '@ballerine/common';

interface IMerchantMonitoringStatusDialogState {
  isOpen: boolean;
  status: UpdateableReportStatus | null;
}

export const useMerchantMonitoringStatusDialog = () => {
  const [dialogState, setDialogState] = useState<IMerchantMonitoringStatusDialogState>({
    isOpen: false,
    status: null,
  });

  const toggleDialogOpenState = useCallback((status: UpdateableReportStatus | null = null) => {
    setDialogState(prev => ({
      ...prev,
      isOpen: !prev.isOpen,
      status,
    }));
  }, []);

  const closeDialog = useCallback(() => {
    setDialogState(prev => ({
      ...prev,
      isOpen: false,
      status: null,
    }));
  }, []);

  const openDialog = useCallback((status: UpdateableReportStatus) => {
    setDialogState(prev => ({
      ...prev,
      isOpen: true,
      status,
    }));
  }, []);

  return { dialogState, toggleDialogOpenState, closeDialog, openDialog };
};
