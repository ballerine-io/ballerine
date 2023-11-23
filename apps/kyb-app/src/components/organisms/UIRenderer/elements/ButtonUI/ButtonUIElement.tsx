import { UIElementComponent } from '@/components/organisms/UIRenderer/types';
import { Button } from '@ballerine/ui';
import { useUIElementHandlers } from '@/components/organisms/UIRenderer/hooks/useUIElementHandlers';
import { useUIElementProps } from '@/components/organisms/UIRenderer/hooks/useUIElementProps';

export const ButtonUIElement: UIElementComponent<{ text: string }> = ({ definition }) => {
  const { onClickHandler } = useUIElementHandlers(definition);
  const { disabled } = useUIElementProps(definition);

  return (
    <Button variant="secondary" onClick={onClickHandler} disabled={disabled}>
      {definition.options.text || 'Click'}
    </Button>
  );
};
