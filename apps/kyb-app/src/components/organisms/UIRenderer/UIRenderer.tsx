import { baseElements } from '@/components/organisms/UIRenderer/base-elements';
import { ElementsMap } from '@/components/organisms/UIRenderer/types/elements.types';
import { generateBlocks } from '@/components/organisms/UIRenderer/utils/generateBlocks';
import { UIElement } from '@/domains/collection-flow';
import { BlocksComponent } from '@ballerine/blocks';
import { AnyObject } from '@ballerine/ui';
import { useMemo } from 'react';
import { uiRendererContext } from './ui-renderer.context';

const { Provider } = uiRendererContext;

export interface UIRendererProps {
  schema: UIElement<AnyObject>[];
  elements?: ElementsMap;
}

const Block = props => <div {...props} />;

export const UIRenderer = ({ schema, elements = baseElements }: UIRendererProps) => {
  //@ts-ignore
  const blocks = useMemo(() => generateBlocks(schema, elements) as any[], [schema, elements]);
  const context = useMemo(() => ({ elements }), [elements]);

  return (
    <Provider value={context}>
      <BlocksComponent Block={Block} cells={elements as any} blocks={blocks}>
        {(Cell, cell) => (Cell ? <Cell {...cell} /> : <div>not implemented</div>)}
      </BlocksComponent>
    </Provider>
  );
};
