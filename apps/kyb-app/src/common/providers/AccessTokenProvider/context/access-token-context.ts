import { createContext } from 'react';
import { IAccessTokenContext } from './types';

export const AccessTokenContext = createContext<IAccessTokenContext>({
  wfIdToken: null,
  accessToken: null,
  setWfIdToken: () => {},
  setAccessToken: () => {},
});
