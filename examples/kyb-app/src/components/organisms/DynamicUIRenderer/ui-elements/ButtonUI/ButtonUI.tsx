import { useHandlers } from '@app/components/organisms/DynamicUIRenderer/hooks/useUIElement/hooks/useHandlers';
import { UIElementComponent } from '@app/components/organisms/DynamicUIRenderer/types';
import { Button } from '@ballerine/ui';

export const ButtonUI: UIElementComponent<{ label: string }> = props => {
  const { handlers } = useHandlers(props.definition.name, props.actions);

  return (
    //@ts-expect-error
    <Button variant="secondary" onClick={handlers.onClick}>
      {props.definition.inputParams.label}
    </Button>
  );
};
