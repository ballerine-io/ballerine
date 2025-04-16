import { TWorkflowById } from '@/domains/workflows/fetchers';
import { TDocument } from '@ballerine/common';
import { IDocumentEntity } from '../types';

export const getUboEntityFromWorkflow = (
  workflow: TWorkflowById,
  document: TDocument,
): IDocumentEntity | undefined => {
  const foundUbo = workflow?.childWorkflows?.find(
    childWorkflow => childWorkflow.context?.entity?.ballerineEntityId === document.endUserId,
  );

  if (!foundUbo) {
    return;
  }

  return {
    id: foundUbo.context?.entity?.ballerineEntityId,
    name: [foundUbo.context?.entity?.data?.firstName, foundUbo.context?.entity?.data?.lastName]
      .filter(Boolean)
      .join(' '),
  };
};
