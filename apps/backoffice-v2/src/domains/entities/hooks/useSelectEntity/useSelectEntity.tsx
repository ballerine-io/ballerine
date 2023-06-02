import { useNavigate, useParams } from 'react-router-dom';
import { useCallback } from 'react';

export const useSelectEntity = () => {
  const navigate = useNavigate();
  const { locale = 'en' } = useParams();

  return useCallback(
    (entityId: string) => () => {
      if (!entityId) return;

      void navigate(`/${locale}/case-management/entities/${entityId}`, {
        replace: true,
      });
    },
    [locale, navigate],
  );
};
