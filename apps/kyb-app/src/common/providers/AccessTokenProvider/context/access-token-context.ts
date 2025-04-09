import { createContext } from 'react';
import { IAccessTokenContext } from './types';

export const AccessTokenContext = createContext<IAccessTokenContext>({
  accessToken: null,
  setAccessToken: () => {},
});
