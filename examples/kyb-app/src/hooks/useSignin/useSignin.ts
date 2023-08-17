import { SigninCredentials, User } from '@app/hooks/useSignin/types';
import { useCallback, useState } from 'react';

export const TOKEN_KEY = 'auth_creds';

export const useSignin = () => {
  const [user, setUser] = useState<User | null>(() =>
    localStorage.getItem(TOKEN_KEY) ? { email: localStorage.getItem(TOKEN_KEY) } : null,
  );

  const signin = useCallback(({ email }: SigninCredentials) => {
    localStorage.setItem(TOKEN_KEY, email);
    setUser({ email });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
  }, []);

  // Clears user session and not causing re-renders
  const logoutSilent = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
  }, []);

  return {
    user,
    signin,
    logout,
    logoutSilent,
  };
};
