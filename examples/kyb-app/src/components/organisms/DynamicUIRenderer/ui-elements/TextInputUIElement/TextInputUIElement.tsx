import { useDynamicUIContext } from '@app/components/organisms/DynamicUIRenderer/hooks/useDynamicUIContext';
import { useUIElement } from '@app/components/organisms/DynamicUIRenderer/hooks/useUIElement';
import { UIElementComponent } from '@app/components/organisms/DynamicUIRenderer/types';
import { AnyObject, Input, Label } from '@ballerine/ui';

export const TextInputUIElement: UIElementComponent<{ title: string; placeholder: string }> = ({
  definition,
  actions,
}) => {
  const { context } = useDynamicUIContext<AnyObject>();
  const { handlers, props } = useUIElement(definition, actions, context);

  return (
    <Label>
      {definition.inputParams.title}
      <Input
        placeholder={definition.inputParams.placeholder}
        onChange={handlers.onChange}
        name={definition.name}
        disabled={props.disabled}
        value={(context[definition.name] as string) || ''}
      />
    </Label>
  );
};
