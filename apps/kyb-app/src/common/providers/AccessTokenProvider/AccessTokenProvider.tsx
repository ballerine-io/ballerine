import { getAccessToken } from '@/helpers/get-access-token.helper';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AccessTokenIsMissingError } from '../../errors/access-token-is-missing';
import { AccessTokenContext } from './context';
import { useWorkflowId } from '@/common/hooks/useWorkflowId';

interface IAccessTokenProviderProps {
  children: React.ReactNode;
}

export const AccessTokenProvider = ({ children }: IAccessTokenProviderProps) => {
  const workflowId = useWorkflowId();
  const [accessToken, setAccessToken] = useState<string | null>(() => getAccessToken());

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
      const previousToken = searchParams.get('token');

      if (previousToken !== accessToken) {
        setSearchParams({ ...searchParams, token: accessToken });
      }
    }
  }, [workflowId, accessToken, searchParams, setSearchParams]);

  useEffect(() => {
    if (!accessToken && !workflowId) {
      throw new AccessTokenIsMissingError();
    }
  }, [accessToken, workflowId]);

  return <AccessTokenContext.Provider value={context}>{children}</AccessTokenContext.Provider>;
};
