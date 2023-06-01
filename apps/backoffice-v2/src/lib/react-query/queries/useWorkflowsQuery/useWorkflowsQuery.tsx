import { useQuery } from '@tanstack/react-query';
import { workflows } from '../../workflows';
import { useIsAuthenticated } from '../../../../context/AuthProvider/hooks/useIsAuthenticated/useIsAuthenticated';

export const useWorkflowsQuery = () => {
  const isAuthenticated = useIsAuthenticated();

  return useQuery({ ...workflows.list(), enabled: isAuthenticated });
};
