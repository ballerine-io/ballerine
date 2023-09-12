import { Action } from '@app/components/organisms/DynamicUIRenderer/temp';

export interface DynamicUIRendererContext<TContext> {
  dispatchActions: (actions: Action[]) => void;
  updateContext: (context: TContext) => TContext;
  getContext: () => TContext;
  isProcessingActions: boolean;
  actions: Action[];
  context: TContext;
}
