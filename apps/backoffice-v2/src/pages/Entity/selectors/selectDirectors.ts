import { AnyObject } from '@ballerine/ui';

export const selectDirectors = (workflow: unknown) =>
  (workflow?.context?.entity?.data?.additionalInfo?.directors as AnyObject[]) || [];
