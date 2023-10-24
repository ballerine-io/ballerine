import { Action, UIElement } from '@app/domains/collection-flow';

export interface UIElementComponentProps<T> {
  params: T;
  definition: UIElement<T>;
  actions: Action[];
}

export type UIElementComponent<T> = React.ComponentType<UIElementComponentProps<T>>;
