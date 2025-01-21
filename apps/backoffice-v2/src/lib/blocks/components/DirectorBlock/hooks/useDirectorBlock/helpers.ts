import { AnyObject } from '@ballerine/ui';
import { createDirectorsBlocks } from './create-directors-blocks';

export const getRevisionReasonsForDocument = (
  { type, category }: AnyObject,
  workflow: AnyObject,
) => {
  if (category === 'proof_of_identity' && type === 'passport')
    return [
      'Blurry image',
      'Bad quality photo',
      'Wrong document',
      'Copy of a copy',
      'Cut document',
    ];

  if (category === 'proof_of_identity_ownership' && type === 'selfie') {
    return [
      'Blurry image',
      'Bad quality photo',
      'Wrong document',
      'Copy of a copy',
      'Person in the selfie does not match ID',
      'There was no person in the photo',
    ];
  }

  return (
    (workflow?.workflowDefinition?.contextSchema?.schema?.properties?.documents?.items?.properties?.decision?.properties?.revisionReason?.anyOf?.find(
      ({ enum: enum_ }) => !!enum_,
    )?.enum as string[]) || ([] as string[])
  );
};

export const directorDocumentsAdapter = ({ documents, storageFiles }) => {
  return documents?.map(
    (document, documentIndex) =>
      ({
        id: document?.id,
        category: document?.category,
        type: document?.type,
        decision: {
          status: document?.decision?.status,
        },
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
