import { useDynamicUIContext } from '@app/components/organisms/DynamicUIRenderer/hooks/useDynamicUIContext';
import { useUIElement } from '@app/components/organisms/DynamicUIRenderer/hooks/useUIElement';
import { UIElementComponent } from '@app/components/organisms/DynamicUIRenderer/types';
import { Button } from '@ballerine/ui';

export const ButtonUIElement: UIElementComponent<{ label: string }> = ({ definition, actions }) => {
  const { context } = useDynamicUIContext();
  const { handlers, props } = useUIElement(definition, actions, context);

  return (
    <Button variant="secondary" onClick={handlers.onClick} disabled={props.disabled}>
      {definition.inputParams.label}
    </Button>
  );
};
