import { useWorkflowId } from '@/common/hooks/useWorkflowId';
import { getAccessToken } from '@/helpers/get-access-token.helper';
import { useLanguageParam } from '@/hooks/useLanguageParam/useLanguageParam';
import { useWorkflowIdQuery } from '@/hooks/useWorkflowIdQuery';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AccessTokenIsMissingError } from '../../errors/access-token-is-missing';
import { AccessTokenContext } from './context';

interface IAccessTokenProviderProps {
  children: React.ReactNode;
}

export const AccessTokenProvider = ({ children }: IAccessTokenProviderProps) => {
  const navigate = useNavigate();
  const { language } = useLanguageParam();
  const workflowId = useWorkflowId();
  const [accessToken, setAccessToken] = useState<string | null>(() => getAccessToken());
  const { workflowId: workflowIdFromServer } = useWorkflowIdQuery();

  const [searchParams, setSearchParams] = useSearchParams();

  const context = useMemo(
    () => ({
      accessToken,
      setAccessToken,
    }),
    [accessToken, setAccessToken],
  );

  useEffect(() => {
    if (accessToken) {
      if (!workflowId && workflowIdFromServer) {
        const searchParamsString = new URLSearchParams({
          workflowId: workflowIdFromServer,
          token: accessToken,
          lng: language,
        }).toString();

        navigate(`/collection-flow/?${searchParamsString}`);
      }

      const previousToken = searchParams.get('token');

      if (previousToken !== accessToken) {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('token', accessToken);

        setSearchParams(newParams);
      }
    }
  }, [
    language,
    workflowId,
    accessToken,
    searchParams,
    workflowIdFromServer,
    navigate,
    setSearchParams,
  ]);

  useEffect(() => {
    if (!accessToken && !workflowId) {
      throw new AccessTokenIsMissingError();
    }
  }, [accessToken, workflowId]);

  return <AccessTokenContext.Provider value={context}>{children}</AccessTokenContext.Provider>;
};
