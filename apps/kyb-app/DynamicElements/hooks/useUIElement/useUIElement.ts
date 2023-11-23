import { useHandlers } from '@/components/organisms/DynamicElements/hooks/useUIElement/hooks/useHandlers';
import { useProperties } from '@/components/organisms/DynamicElements/hooks/useUIElement/hooks/useProperties';
import { Action, UIElement } from '@/domains/collection-flow';

export const useUIElement = <TInputParams, TContext>(
  definition: UIElement<TInputParams>,
  actions: Action[],
  context: TContext,
) => {
  const { handlers } = useHandlers(definition, actions);
  const props = useProperties(definition, context);

  return {
    handlers,
    props,
  };
};
