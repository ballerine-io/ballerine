import { useQuery } from '@tanstack/react-query';
import { IEndUserIdAndWorkflowId } from 'src/api/interfaces';
import { workflows } from '../../workflows';

export const useWorkflowQuery = ({ endUserId, workflowId }: IEndUserIdAndWorkflowId) => {
  return useQuery({
    ...workflows.byId({ endUserId, workflowId }),
    enabled: !!endUserId && !!workflowId,
  });
};
