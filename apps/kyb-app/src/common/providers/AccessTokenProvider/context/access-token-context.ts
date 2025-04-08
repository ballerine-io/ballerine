import { createContext } from 'react';
import { IAccessTokenContext } from './types';

export const AccessTokenContext = createContext<IAccessTokenContext>({
  workflowId: null,
  accessToken: null,
  setWorkflowId: () => {},
  setAccessToken: () => {},
});
