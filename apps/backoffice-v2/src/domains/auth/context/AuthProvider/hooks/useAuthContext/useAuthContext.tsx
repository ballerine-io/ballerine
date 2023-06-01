import { useContext } from 'react';
import { AuthContext } from '../../AuthProvider';

export const useAuthContext = () => {
  const values = useContext(AuthContext);

  if (!values) {
    throw new Error('useAuthContext must be used within a AuthContext.');
  }

  return values;
};
