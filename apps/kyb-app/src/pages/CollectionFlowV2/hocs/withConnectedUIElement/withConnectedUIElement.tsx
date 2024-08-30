import { UIElementV2 } from '@/components/providers/Validator/types';
import { useUIElementProps } from '@/pages/CollectionFlowV2/hocs/withConnectedUIElement/hooks/useUIElementProps';
import { IUIComponentProps } from '@/pages/CollectionFlowV2/types';
import { IRendererComponent } from '@ballerine/ui';

export function withConnectedUIElement<TOptions>(
  Component: React.ComponentType<IUIComponentProps<TOptions>>,
) {
  const ConnectedUIElement: IRendererComponent<UIElementV2, {}> = ({
    children,
    stack,
    definition,
    options,
  }) => {
    const props: IUIComponentProps<TOptions> = {
      options: options as TOptions,
      definition,
      children,
      stack,
      uiElementProps: useUIElementProps(definition, {}, stack || []),
    };

    return <Component {...props} />;
  };

  ConnectedUIElement.displayName = `ConnectedUIElementWrapper(${
    Component.displayName || Component.name
  })`;

  return ConnectedUIElement;
}
