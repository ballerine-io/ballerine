import { createDirectorsBlocks } from './create-directors-blocks';

export const directorDocumentsAdapter = ({ documents, storageFiles }) => {
  return documents?.map(
    (document, documentIndex) =>
      ({
        ...document,
        pages: document?.pages?.map(
          (page, pageIndex) =>
            ({
              ...page,
              // EditableDetails updates a document by replacing it, we need document to be complete,
              // and imageUrl to be omitted in the documents passed to the details cell.
              imageUrl: storageFiles?.[documentIndex]?.[pageIndex],
            } satisfies Parameters<
              typeof createDirectorsBlocks
            >[0]['directors'][number]['documents'][number]['pages'][number]),
        ),
      } satisfies Parameters<
        typeof createDirectorsBlocks
      >[0]['directors'][number]['documents'][number]),
  );
};

export const directorAdapter =
  storageFiles =>
  ({ ballerineEntityId, firstName, lastName, additionalInfo }) => {
    const documents = directorDocumentsAdapter({
      documents: additionalInfo?.documents,
      storageFiles,
    });

    return {
      id: ballerineEntityId,
      firstName,
      lastName,
      documents,
    } satisfies Parameters<typeof createDirectorsBlocks>[0]['directors'][number];
  };
