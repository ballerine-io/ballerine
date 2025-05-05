export const buildCollectionFlowUrl = (
  collectionFlowBaseUrl: string | undefined,
  {
    token,
    workflowId,
  }: {
    token?: string | undefined;
    workflowId: string | undefined;
  },
) => {
  if (!collectionFlowBaseUrl) {
    return '';
  }

  const basePath = `${collectionFlowBaseUrl}/collection-flow`;

  const params = `?workflowId=${encodeURIComponent(workflowId ?? '')}${
    token ? `&token=${encodeURIComponent(token)}` : ''
  }`;

  return `${basePath}${params}`;
};
