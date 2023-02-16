import { useQuery } from '@tanstack/react-query';
import { auth } from '../../auth';

export const useGetSessionQuery = () => {
  return useQuery(auth.getSession());
};
