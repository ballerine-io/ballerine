import { TWorkflowById } from '@/domains/workflows/fetchers';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getCollectionFlowLinkFromWorkflow } from '../../../helpers/get-collection-flow-link-from-workflow';

export const useCopyCollectionFlowLinkMutation = ({ workflow }: { workflow: TWorkflowById }) => {
  return useMutation({
    mutationFn: async () => {
      const url = getCollectionFlowLinkFromWorkflow(workflow);
      await navigator.clipboard.writeText(url);
    },
    onSuccess: () => {
      toast.success('Collection flow link copied to clipboard');
    },
    onError: error => {
      console.error('Failed to copy collection flow link:', error);
      toast.error('Failed to copy collection flow link');
    },
  });
};
