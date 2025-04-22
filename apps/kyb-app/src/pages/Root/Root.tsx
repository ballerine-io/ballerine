import { useAccessToken } from '@/common/providers/AccessTokenProvider';
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useIsSignupRequired } from './hooks/useIsSignupRequired';
import { useWorkflowId } from '@/common/hooks/useWorkflowId';
import { useLanguageParam } from '@/hooks/useLanguageParam/useLanguageParam';

export const Root = () => {
  const { isLoading, isSignupRequired } = useIsSignupRequired();
  const navigate = useNavigate();
  const { accessToken } = useAccessToken();
  const workflowId = useWorkflowId();
  const { language } = useLanguageParam();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    const searchParamsString = new URLSearchParams({
      ...(workflowId ? { workflowId } : {}),
      ...(accessToken ? { token: accessToken } : {}),
      lng: language,
    }).toString();

    void navigate(`/${isSignupRequired ? 'signup' : 'collection-flow'}/?${searchParamsString}`);
  }, [isSignupRequired, isLoading, accessToken, workflowId, navigate, language]);

  return <Outlet />;
};
