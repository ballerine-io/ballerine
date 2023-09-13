import { ActionHandler } from '@app/components/organisms/DynamicUIRenderer/action-handlers/action-handler.abstract';
import { DynamicUIRendererContext } from '@app/components/organisms/DynamicUIRenderer/context';
import { useActionsHandler } from '@app/components/organisms/DynamicUIRenderer/hooks/useActionsHandler';
import { useContext } from '@app/components/organisms/DynamicUIRenderer/hooks/useContext';
import { Action, UIElement } from '@app/components/organisms/DynamicUIRenderer/temp';
import { AnyObject } from '@ballerine/ui';
import { useMemo } from 'react';
import { dynamicUIRendererContext } from './context';
import { UIElementComponent } from '@app/components/organisms/DynamicUIRenderer/types';
import { UIElementsList } from '@app/components/organisms/DynamicUIRenderer/components/UIElementsList';

const { Provider } = dynamicUIRendererContext;

interface Props<TContext> {
  context: TContext;
  actionHandlers: ActionHandler[];
  actions: Action[];
  uiElements: UIElement<AnyObject>[];
  elements?: Record<string, UIElementComponent>;
}

export function DynamicUIRenderer<TContext>({
  context: _context,
  actionHandlers,
  actions,
  uiElements,
  elements,
}: Props<TContext>) {
  const { context, updateContext, getContext } = useContext<TContext>(_context);
  const { isProcessingActions, dispatchActions } = useActionsHandler(
    getContext,
    updateContext,
    actionHandlers,
  );

  const dynamicUIctx: DynamicUIRendererContext<any> = useMemo(() => {
    return {
      dispatchActions,
      updateContext,
      getContext,
      isProcessingActions,
      actions,
      context,
    };
  }, [dispatchActions, updateContext, getContext, isProcessingActions, actions, context]);

  return (
    <Provider value={dynamicUIctx}>
      <UIElementsList elements={elements} definitions={uiElements} />
    </Provider>
  );
}
