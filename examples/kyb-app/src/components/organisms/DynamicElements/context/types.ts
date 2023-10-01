import { Action, UIElement } from '@app/components/organisms/DynamicElements/types';
import { AnyObject } from '@ballerine/ui';

export interface DynamicUIRendererContext<TContext> {
  dispatchActions: (actions: Action[]) => void;
  updateContext: (caller: UIElement<AnyObject>, value: unknown, context: TContext) => TContext;
  getContext: () => TContext;
  isProcessingActions: boolean;
  actions: Action[];
  context: TContext;
  errors: AnyObject;
}
