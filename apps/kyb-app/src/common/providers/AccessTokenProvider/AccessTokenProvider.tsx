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
  const [wfIdToken, setWfIdToken] = useState<string | null>(() => getAccessToken('wf-id'));

  const [searchParams, setSearchParams] = useSearchParams();

  const context = useMemo(
    () => ({
      wfIdToken,
      accessToken,
      setAccessToken,
      setWfIdToken,
    }),
    [wfIdToken, accessToken, setWfIdToken, setAccessToken],
  );

  useEffect(() => {
    if (wfIdToken) {
      const previousToken = searchParams.get('wf-id');

      if (previousToken !== wfIdToken) {
        setSearchParams({ 'wf-id': wfIdToken });
      }

      return;
    }

    if (accessToken) {
      const previousToken = searchParams.get('token');

      if (previousToken !== accessToken) {
        setSearchParams({ token: accessToken });
      }
    }
  }, [wfIdToken, accessToken, searchParams, setSearchParams]);

  useEffect(() => {
    if (!accessToken && !wfIdToken) {
      throw new AccessTokenIsMissingError();
    }
  }, [accessToken, wfIdToken]);

  return <AccessTokenContext.Provider value={context}>{children}</AccessTokenContext.Provider>;
};
