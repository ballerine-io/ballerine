import { useAccessToken } from '@/common/providers/AccessTokenProvider';
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useIsSignupRequired } from './hooks/useIsSignupRequired';
import { useWorkflowId } from '@/common/hooks/useWorkflowId';
import { createQueryParamsString } from '@/common/utils/create-query-params-string';
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

    void navigate(
      `/${isSignupRequired ? 'signup' : 'collection-flow'}/${workflowId}${createQueryParamsString({
        token: accessToken,
        lng: language,
      })}`,
    );
  }, [isSignupRequired, isLoading, accessToken, workflowId, navigate]);

  return <Outlet />;
};
