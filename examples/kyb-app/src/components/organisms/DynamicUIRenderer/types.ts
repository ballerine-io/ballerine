import { Action, UIElement } from '@app/components/organisms/DynamicUIRenderer/temp';
import { AnyObject } from '@ballerine/ui';

interface UIElementProps<TElementParams> {
  definition: UIElement<TElementParams>;
  actions: Action[];
}

export type UIElementComponent<TElementParams = AnyObject> = React.ComponentType<
  UIElementProps<TElementParams>
>;
