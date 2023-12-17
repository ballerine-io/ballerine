import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useCallback, useMemo } from 'react';
import { getAccessToken } from '@/helpers/get-access-token.helper';

export const useLanguageParam = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [params] = useSearchParams();

  const currentLanguage = useMemo(() => params.get('lng') || 'en', [params]);

  const setLanguage = useCallback(
    (language: string) => {
      const token = getAccessToken();

      navigate(`/collection-flow?token=${token}&lng=${language}`, {
        replace: true,
        state: {
          from: state?.from,
        },
      });
    },
    [navigate, state],
  );

  return { language: currentLanguage, setLanguage };
};
