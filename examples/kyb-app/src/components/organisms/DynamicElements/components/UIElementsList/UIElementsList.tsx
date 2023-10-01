import { useDynamicUIContext } from '@app/components/organisms/DynamicElements/hooks/useDynamicUIContext';
import { UIElement, UIElementComponent } from '@app/components/organisms/DynamicElements/types';

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

        return Component ? (
          <Component key={definition.name} actions={actions} definition={definition} />
        ) : null;
      })}
    </div>
  );
};
