import { Action, UIElement } from '@app/domains/collection-flow';
import { AnyObject } from '@ballerine/ui';

export type UIElementType = 'text' | 'button';
interface UIElementProps<TElementParams> {
  definition: UIElement<TElementParams>;
  actions: Action[];
}

export type UIElementComponent<TElementParams = AnyObject> = React.ComponentType<
  UIElementProps<TElementParams>
>;
