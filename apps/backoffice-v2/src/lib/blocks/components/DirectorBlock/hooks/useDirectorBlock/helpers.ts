import { createDirectorsBlocks } from './create-directors-blocks';

export const directorDocumentsAdapter = ({ documents, storageFiles }) => {
  return documents?.map(
    (document, documentIndex) =>
      ({
        id: document?.id,
        category: document?.category,
        type: document?.type,
        issuer: {
          country: document?.issuer?.country,
        },
        decision: {
          status: document?.decision?.status,
        },
        version: document?.version,
        properties: document?.properties,
        propertiesSchema: document?.propertiesSchema,
        pages: document?.pages?.map(
          (page, pageIndex) =>
            ({
              type: page?.type,
              imageUrl: storageFiles?.[documentIndex]?.[pageIndex],
              metadata: {
                side: page?.metadata?.side,
              },
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
