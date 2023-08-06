import { AnyObject } from '@ballerine/ui';

export interface ViewsData {
  currentView: string;
  shared: AnyObject;
  flowData: AnyObject;
  completionMap: Record<string, boolean>;
}
