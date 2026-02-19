import { AnyObject } from '@ballerine/ui';

export interface UISchema<TElementOptions = AnyObject> {
  type: string;
  options: TElementOptions;
  elements?: Array<UISchema<TElementOptions>>;
}
