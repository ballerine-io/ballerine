import { useNavigate, useParams } from '@tanstack/react-router';
import { useCallback } from 'react';
import { entityRoute } from '../../../routes/Entity/Entity.route';

export const useSelectEntity = () => {
  const navigate = useNavigate();
  const { locale = 'en' } = useParams();

  return useCallback(
    (entityId: string) => () => {
      if (!entityId) return;

      void navigate({
        replace: true,
        to: entityRoute.id,
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
