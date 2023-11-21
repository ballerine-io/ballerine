import { AnyObject } from '@ballerine/ui';

export const selectDirectorsDocuments = (workflow: unknown): AnyObject[] =>
  //@ts-ignore
  ((workflow?.context?.entity?.data?.additionalInfo?.directors as AnyObject[]) || [])
    .map(director => director.additionalInfo?.documents)
    ?.filter(Boolean)
    ?.flat() ||
  ([] as AnyObject[]) ||
  [];
