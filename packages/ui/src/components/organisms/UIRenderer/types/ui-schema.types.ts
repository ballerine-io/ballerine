import { AnyObject } from '@common/types';

export interface UISchema<TElementOptions = AnyObject> {
  type: string;
  options: TElementOptions;
  elements?: UISchema<TElementOptions>[];
}
