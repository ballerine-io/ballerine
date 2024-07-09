import { useLocation, useNavigate } from 'react-router-dom';
import { useCallback } from 'react';
import { useLocale } from '@/common/hooks/useLocale/useLocale';

export const useSelectEntity = () => {
  const navigate = useNavigate();
  const locale = useLocale();
  const { search, state } = useLocation();

  return useCallback(
    (entityId: string) => () => {
      if (!entityId) return;

      void navigate(`/${locale}/case-management/entities/${entityId}${search}`, {
        replace: true,
        state: {
          from: state?.from,
        },
      });
    },
    [locale, navigate, search],
  );
};
