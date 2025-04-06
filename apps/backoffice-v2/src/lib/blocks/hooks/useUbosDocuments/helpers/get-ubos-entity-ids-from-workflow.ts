import { TWorkflowById } from '@/domains/workflows/fetchers';

export const getUbosEntityIdsFromWorkflow = (workflow: TWorkflowById) => {
  const directorsIds =
    workflow?.context?.entity?.data?.additionalInfo?.directors
      ?.map(director => director.ballerineEntityId)
      .filter(Boolean) ?? [];

  return (
    workflow?.childWorkflows
      ?.filter(
        childWorkflow =>
          childWorkflow.context?.entity?.variant === 'ubo' &&
          !directorsIds.includes(childWorkflow.context?.entity?.ballerineEntityId),
      )
      ?.map(childWorkflow => childWorkflow.context?.entity?.ballerineEntityId)
      .filter(Boolean) ?? []
  );
};
