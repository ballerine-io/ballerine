import { getAccessToken } from '@/helpers/get-access-token.helper';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AccessTokenIsMissingError } from '../../errors/access-token-is-missing';
import { AccessTokenContext } from './context';

interface IAccessTokenProviderProps {
  children: React.ReactNode;
}

export const AccessTokenProvider = ({ children }: IAccessTokenProviderProps) => {
  const [accessToken, setAccessToken] = useState<string | null>(() => getAccessToken());
  const [workflowId, setWorkflowId] = useState<string | null>(() => getAccessToken('workflowId'));

  const [searchParams, setSearchParams] = useSearchParams();

  const context = useMemo(
    () => ({
      workflowId,
      accessToken,
      setAccessToken,
      setWorkflowId,
    }),
    [workflowId, accessToken, setWorkflowId, setAccessToken],
  );

  useEffect(() => {
    if (workflowId) {
      const previousToken = searchParams.get('workflowId');

      if (previousToken !== workflowId) {
        setSearchParams({ workflowId: workflowId });
      }

      return;
    }

    if (accessToken) {
      const previousToken = searchParams.get('token');

      if (previousToken !== accessToken) {
        setSearchParams({ token: accessToken });
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
