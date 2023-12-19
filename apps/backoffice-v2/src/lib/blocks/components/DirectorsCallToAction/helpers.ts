import { AnyObject } from '@ballerine/ui';

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
