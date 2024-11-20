import { createContext } from 'react';
import { IDependenciesContext } from './types';

export const DependenciesContext = createContext<IDependenciesContext>({
  refetchAll: async () => {},
  isLoading: false,
  isFetching: false,
});
