import { TWorkflowById } from '@/domains/workflows/fetchers';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useCopyCollectionFlowLinkMutation = ({ workflow }: { workflow: TWorkflowById }) => {
  return useMutation({
    mutationFn: async () => {
      if (!workflow?.context?.metadata?.collectionFlowUrl || !workflow?.context?.metadata?.token) {
        throw new Error('Collection flow URL or token not available');
      }

      const url = `${workflow.context.metadata.collectionFlowUrl}?token=${workflow.context.metadata.token}`;
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
