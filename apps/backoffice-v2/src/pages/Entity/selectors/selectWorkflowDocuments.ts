import { AnyObject } from '@ballerine/ui';

export const selectWorkflowDocuments = (workflow: unknown): AnyObject[] =>
  //@ts-ignore
  (workflow?.context?.documents as AnyObject[]) || ([] as AnyObject[]);
