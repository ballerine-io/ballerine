import { useHandlers } from '@app/components/organisms/DynamicUIRenderer/hooks/useUIElement/hooks/useHandlers';
import { useProperties } from '@app/components/organisms/DynamicUIRenderer/hooks/useUIElement/hooks/useProperties';
import { Action, UIElement } from '@app/components/organisms/DynamicUIRenderer/temp';

export const useUIElement = <TInputParams, TContext>(
  definition: UIElement<TInputParams>,
  actions: Action[],
  context: TContext,
) => {
  const { handlers } = useHandlers(definition.name, actions);
  const props = useProperties(definition, context);

  return {
    handlers,
    props,
  };
};
