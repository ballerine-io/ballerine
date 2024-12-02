import { getAccessToken } from '@/helpers/get-access-token.helper';
import { getDefaultLocalAccessToken } from '@/helpers/get-default-local-access-token';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AccessTokenIsMissingError } from '../../errors/access-token-is-missing';
import { AccessTokenContext } from './context';

interface IAccessTokenProviderProps {
  children: React.ReactNode;
}

export const AccessTokenProvider = ({ children }: IAccessTokenProviderProps) => {
  const [accessToken, setAccessToken] = useState<string | null>(
    () => getAccessToken() ?? getDefaultLocalAccessToken(),
  );
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
        setSearchParams({ token: accessToken });
      }
    }
  }, [accessToken, searchParams, setSearchParams]);

  useEffect(() => {
    if (!accessToken) {
      throw new AccessTokenIsMissingError();
    }
  }, [accessToken]);

  return <AccessTokenContext.Provider value={context}>{children}</AccessTokenContext.Provider>;
};
