export const buildCollectionFlowUrl = (
  collectionFlowBaseUrl: string | undefined,
  {
    token,
    workflowId,
  }: {
    token: string | undefined;
    workflowId: string | undefined;
  },
) =>
  collectionFlowBaseUrl
    ? `${collectionFlowBaseUrl}/collection-flow?workflowId=${workflowId ?? ''}&token=${token ?? ''}`
    : '';
