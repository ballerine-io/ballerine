import { useQuery } from '@tanstack/react-query';
import { workflows } from '../../workflows';

export const useWorkflowsQuery = () => {
  return useQuery({ ...workflows.list() });
};
