import { UIElementV2 } from '@/components/providers/Validator/types';
import { useStack } from '@/pages/CollectionFlowV2/components/ui/fields/FieldList/providers/StackProvider';
import { useFieldProps } from '@/pages/CollectionFlowV2/hocs/withConnectedField/hooks/useFieldProps';
import { IFieldComponentProps } from '@/pages/CollectionFlowV2/types';
import { IRendererComponent } from '@ballerine/ui';

export function withConnectedField<TValueType, TOptions>(
  Component: React.ComponentType<IFieldComponentProps<TValueType, TOptions>>,
) {
  const ConnectedFieldComponent: IRendererComponent<UIElementV2, {}> = ({
    children,
    definition,
    options,
  }) => {
    const { stack } = useStack();

    const props: IFieldComponentProps<TValueType, TOptions> = {
      options: options as TOptions,
      definition,
      children,
      stack,
      fieldProps: useFieldProps<TValueType>(definition, stack || []),
    };

    return <Component {...props} />;
  };

  ConnectedFieldComponent.displayName = `ConnectedFieldWrapper(${
    Component.displayName || Component.name
  })`;

  return ConnectedFieldComponent;
}
