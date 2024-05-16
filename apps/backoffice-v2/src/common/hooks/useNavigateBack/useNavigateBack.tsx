import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';

export const useNavigateBack = () => {
  const navigate = useNavigate();
  const navigateBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  return navigateBack;
};
