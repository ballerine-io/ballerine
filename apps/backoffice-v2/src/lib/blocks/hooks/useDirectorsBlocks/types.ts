import { DefaultContextSchema } from '@ballerine/common';
import { AnyObject } from '@ballerine/ui';

export type Director = AnyObject;
export type DecisionStatus = NonNullable<
  DefaultContextSchema['documents'][number]['decision']
>['status'];
