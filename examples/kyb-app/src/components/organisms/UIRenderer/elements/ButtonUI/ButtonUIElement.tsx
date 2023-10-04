import { UIElementComponent } from '@app/components/organisms/UIRenderer/types';
import { Button } from '@ballerine/ui';
import { useUIElementHandlers } from '@app/components/organisms/UIRenderer/hooks/useUIElementHandlers';

export const ButtonUIElement: UIElementComponent<{ text: string }> = ({ definition }) => {
  const { onClickHandler } = useUIElementHandlers(definition);

  return (
    <Button variant="secondary" onClick={onClickHandler}>
      {definition.options.text || 'Click'}
    </Button>
  );
};
