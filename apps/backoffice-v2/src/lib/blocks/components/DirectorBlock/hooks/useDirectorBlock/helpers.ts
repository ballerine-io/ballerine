import { createDirectorsBlocks } from './create-directors-blocks';

export const directorAdapter = ({ ballerineEntityId, firstName, lastName, additionalInfo }) => {
  return {
    id: ballerineEntityId,
    firstName,
    lastName,
    documents: additionalInfo?.documents,
  } satisfies Parameters<typeof createDirectorsBlocks>[0]['directors'][number];
};
