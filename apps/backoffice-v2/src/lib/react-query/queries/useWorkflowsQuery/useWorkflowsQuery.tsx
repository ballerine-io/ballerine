import { useQuery } from '@tanstack/react-query';
import { workflows } from '../../workflows';

export const useWorkflowsQuery = ({ endUserId }: { endUserId?: string } = {}) => {
  return useQuery({ ...workflows.list(endUserId) });
};
