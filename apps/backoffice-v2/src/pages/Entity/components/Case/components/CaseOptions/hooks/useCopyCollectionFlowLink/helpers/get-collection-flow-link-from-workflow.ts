import { TWorkflowById } from '@/domains/workflows/fetchers';

export const getCollectionFlowLinkFromWorkflow = (workflow: TWorkflowById) => {
  if (!workflow.context?.metadata?.collectionFlowUrl || !workflow.context?.metadata?.token) {
    throw new Error('Collection flow URL or token not available');
  }

  const url = `${workflow.context.metadata.collectionFlowUrl}?token=${workflow.context.metadata.token}`;

  return url;
};
