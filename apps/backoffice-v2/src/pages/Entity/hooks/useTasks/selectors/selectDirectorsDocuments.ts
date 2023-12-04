import { AnyObject } from '@ballerine/ui';
import { selectDirectors } from './selectDirectors';

export const selectDirectorsDocuments = (workflow: unknown): AnyObject[] =>
  //@ts-ignore
  selectDirectors(workflow)
    .map(director => director.additionalInfo?.documents)
    ?.filter(Boolean)
    ?.flat() ||
  ([] as AnyObject[]) ||
  [];
