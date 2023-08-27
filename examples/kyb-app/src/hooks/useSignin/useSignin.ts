import { authorizeUser } from '@app/domains/collection-flow';
import { SigninCredentials } from '@app/hooks/useSignin/types';
import { useCallback, useState } from 'react';

export const TOKEN_KEY = 'auth_creds';

export const useSignin = () => {
  const [isSigningIn, setSigningIn] = useState(false);

  const signin = useCallback(async ({ email }: SigninCredentials) => {
    setSigningIn(true);
    await authorizeUser({ email });

    localStorage.setItem(TOKEN_KEY, email);

    setSigningIn(false);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    location.href = '/';
  }, []);

  // Clears user session and not causing re-renders
  const logoutSilent = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
  }, []);

  return {
    isSigningIn,
    signin,
    logout,
    logoutSilent,
  };
};
