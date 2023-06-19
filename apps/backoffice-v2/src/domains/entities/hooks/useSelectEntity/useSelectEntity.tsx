import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useCallback } from 'react';

export const useSelectEntity = () => {
  const navigate = useNavigate();
  const { locale = 'en' } = useParams();
  const { search } = useLocation();

  return useCallback(
    (entityId: string) => () => {
      if (!entityId) return;

      void navigate(`/${locale}/case-management/entities/${entityId}${search}`, {
        replace: true,
      });
    },
    [locale, navigate, search],
  );
};
