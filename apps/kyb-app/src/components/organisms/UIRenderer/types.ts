import { Action, UIElementDefinition } from '@/domains/collection-flow';

export interface UIElementComponentProps<T> {
  params: T;
  definition: UIElementDefinition<T>;
  actions: Action[];
}

export type UIElementComponent<T> = React.ComponentType<UIElementComponentProps<T>>;
