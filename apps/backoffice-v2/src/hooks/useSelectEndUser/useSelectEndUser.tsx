import { useNavigate, useParams } from '@tanstack/react-router';
import { useCallback } from 'react';
import { individualRoute } from 'components/pages/Individual/Individual.route';

export const useSelectEndUser = () => {
  const navigate = useNavigate();
  const { locale = 'en' } = useParams();

  return useCallback(
    (endUserId: string) => () => {
      if (!endUserId) return;

      navigate({
        replace: true,
        to: individualRoute.id,
        params: params => ({
          ...params,
          endUserId,
          locale,
        }),
      });
    },
    [locale, navigate],
  );
};
