import { useDynamicUIContext } from '@/components/organisms/DynamicElements/hooks/useDynamicUIContext';
import { UIElementComponent } from '@/components/organisms/DynamicElements/types';
import { UIElement } from '@/domains/collection-flow';

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
