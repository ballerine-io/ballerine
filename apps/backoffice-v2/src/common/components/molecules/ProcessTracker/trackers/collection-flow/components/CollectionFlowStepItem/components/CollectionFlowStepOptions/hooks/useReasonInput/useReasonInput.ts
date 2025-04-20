import { useCallback, useState } from 'react';

export const useReasonInput = () => {
  const [reason, setReason] = useState('');

  const clearReason = useCallback(() => {
    setReason('');
  }, []);

  return { reason, setReason, clearReason };
};
