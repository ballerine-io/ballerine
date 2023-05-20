import { useNavigate, useParams } from '@tanstack/react-router';
import { useCallback } from 'react';
import { individualRoute } from 'components/pages/Individual/Individual.route';

export const useSelectEntity = () => {
  const navigate = useNavigate();
  const { locale = 'en' } = useParams();

  return useCallback(
    (entityId: string) => () => {
      if (!entityId) return;

      void navigate({
        replace: true,
        to: individualRoute.id,
        params: {
          entityId,
          locale,
        },
        search: undefined,
      });
    },
    [locale, navigate],
  );
};
