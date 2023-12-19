import { baseElements } from '@/components/organisms/UIRenderer/base-elements';
import { ElementsMap } from '@/components/organisms/UIRenderer/types/elements.types';
import { generateBlocks } from '@/components/organisms/UIRenderer/utils/generateBlocks';
import { UIElement } from '@/domains/collection-flow';
import { BlocksComponent } from '@ballerine/blocks';
import { AnyObject } from '@ballerine/ui';
import { ComponentProps, FunctionComponent, useMemo } from 'react';
import { UiRendererContext } from './ui-renderer.context';

export interface UIRendererProps {
  schema: UIElement<AnyObject>[];
  elements?: ElementsMap;
}

const Block: FunctionComponent<ComponentProps<'div'>> = props => <div {...props} />;

export const UIRenderer = ({ schema, elements = baseElements }: UIRendererProps) => {
  const blocks = useMemo(() => generateBlocks(schema, elements) as any[], [schema, elements]);
  const context = useMemo(() => ({ elements }), [elements]);

  return (
    <UiRendererContext.Provider value={context}>
      <BlocksComponent Block={Block} cells={elements as any} blocks={blocks}>
        {(Cell, cell) => (Cell ? <Cell {...cell} /> : <div>not implemented</div>)}
      </BlocksComponent>
    </UiRendererContext.Provider>
  );
};
