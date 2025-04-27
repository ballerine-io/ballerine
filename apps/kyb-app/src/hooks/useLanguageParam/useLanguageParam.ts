import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useCallback, useMemo } from 'react';
import { getAccessToken } from '@/helpers/get-access-token.helper';
import { useWorkflowId } from '@/common/hooks/useWorkflowId';

export const useLanguageParam = () => {
  const { state } = useLocation();
  const workflowId = useWorkflowId();
  const navigate = useNavigate();

  const [params] = useSearchParams();

  const currentLanguage = useMemo(() => params.get('lng') || 'en', [params]);

  const setLanguage = useCallback(
    (language: string) => {
      const token = getAccessToken();

      const searchParamsString = new URLSearchParams({
        ...(workflowId ? { workflowId } : {}),
        ...(token ? { token } : {}),
        lng: language,
      }).toString();

      navigate(`/collection-flow/?${searchParamsString}`, {
        replace: true,
        state: {
          from: state?.from,
        },
      });

      location.reload();
    },
    [navigate, state, workflowId],
  );

  return { language: currentLanguage, setLanguage };
};
