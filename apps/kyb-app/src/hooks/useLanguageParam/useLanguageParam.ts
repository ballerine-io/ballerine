import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useCallback, useMemo } from 'react';
import { getAccessToken } from '@/helpers/get-access-token.helper';
import { useWorkflowId } from '@/common/hooks/useWorkflowId';
import { createQueryParamsString } from '@/common/utils/create-query-params-string';

export const useLanguageParam = () => {
  const { state } = useLocation();
  const workflowId = useWorkflowId();
  const navigate = useNavigate();

  const [params] = useSearchParams();

  const currentLanguage = useMemo(() => params.get('lng') || 'en', [params]);

  const setLanguage = useCallback(
    (language: string) => {
      const token = getAccessToken();

      navigate(
        `/collection-flow/${createQueryParamsString({ workflowId, token, lng: language })}`,
        {
          replace: true,
          state: {
            from: state?.from,
          },
        },
      );

      location.reload();
    },
    [navigate, state, workflowId],
  );

  return { language: currentLanguage, setLanguage };
};
