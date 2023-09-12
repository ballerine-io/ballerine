import { Action } from '@app/components/organisms/DynamicUIRenderer/temp';

export interface DynamicUIRendererContext<TContext> {
  dispatchActions: (actions: Action[]) => void;
  isProcessingActions: boolean;
  actions: Action[];
  context: TContext;
}
