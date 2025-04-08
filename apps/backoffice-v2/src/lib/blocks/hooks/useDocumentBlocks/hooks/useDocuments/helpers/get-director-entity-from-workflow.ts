import { TWorkflowById } from '@/domains/workflows/fetchers';
import { selectDirectors } from '@/pages/Entity/selectors/selectDirectors';
import { TDocument } from '@ballerine/common';

export const getDirectorEntityFromWorkflow = (workflow: TWorkflowById, document: TDocument) => {
  const directors = selectDirectors(workflow);

  const foundDirector = directors.find(
    director => director.ballerineEntityId === document.endUserId,
  );

  if (!foundDirector) {
    return;
  }

  return {
    id: foundDirector.ballerineEntityId,
    name: [foundDirector.firstName, foundDirector.lastName].filter(Boolean).join(' '),
  };
};
