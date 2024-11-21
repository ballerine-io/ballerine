import { useContext } from 'react';
import { AccessTokenContext } from '../../context';

export const useAccessToken = () => {
  return useContext(AccessTokenContext);
};
