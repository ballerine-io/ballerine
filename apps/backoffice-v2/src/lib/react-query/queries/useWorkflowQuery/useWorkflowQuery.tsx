import { useQuery } from '@tanstack/react-query';
import { workflows } from '../../workflows';

export const useWorkflowQuery = ({ endUserId }: { endUserId: string }) => {
  return useQuery({
    ...workflows.byId({ endUserId }),
    enabled: !!endUserId,
  });
};
