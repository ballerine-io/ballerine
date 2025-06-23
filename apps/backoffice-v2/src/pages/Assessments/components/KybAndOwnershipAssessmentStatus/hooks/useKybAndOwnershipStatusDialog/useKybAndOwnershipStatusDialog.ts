import { useCallback, useState } from 'react';
import { UpdateableAssessmentStatus } from '@ballerine/common';

interface IAssessmentStatusDialogState {
  isOpen: boolean;
  status: UpdateableAssessmentStatus | null;
}

export const useKybAndOwnershipStatusDialog = () => {
  const [dialogState, setDialogState] = useState<IAssessmentStatusDialogState>({
    isOpen: false,
    status: null,
  });

  const toggleDialogOpenState = useCallback((status: UpdateableAssessmentStatus | null = null) => {
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

  const openDialog = useCallback((status: UpdateableAssessmentStatus) => {
    setDialogState(prev => ({
      ...prev,
      isOpen: true,
      status,
    }));
  }, []);

  return { dialogState, toggleDialogOpenState, closeDialog, openDialog };
};
