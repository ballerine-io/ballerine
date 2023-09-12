import { useDynamicUIContext } from '@app/components/organisms/DynamicUIRenderer/hooks/useDynamicUIContext';
import { UIElement } from '@app/components/organisms/DynamicUIRenderer/temp';
import { UIElementComponent } from '@app/components/organisms/DynamicUIRenderer/types';

interface Props {
  elements: Record<string, UIElementComponent>;
  definitions: UIElement<any>[];
}

export const UIElementsList = ({ elements, definitions }: Props) => {
  const { actions } = useDynamicUIContext();

  return (
    <div className="flex flex-col gap-2">
      {definitions.map(definition => {
        const Component = elements[definition.type];
        console.log('def', definition);

        return Component ? (
          <Component key={definition.name} actions={actions} definition={definition} />
        ) : null;
      })}
    </div>
  );
};
