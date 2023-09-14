import { BlocksComponent, CellsMap } from '@ballerine/blocks';
import { baseElements } from '@components/organisms/UIRenderer/base-elements';
import { ElementsMap } from '@components/organisms/UIRenderer/types/elements.types';
import { UISchema } from '@components/organisms/UIRenderer/types/ui-schema.types';
import { generateBlocks } from '@components/organisms/UIRenderer/utils/generateBlocks';
import { useMemo } from 'react';

export interface UIRendererProps {
  schema: UISchema;
  elements?: ElementsMap;
}

export const UIRenderer = ({ schema, elements = baseElements }: UIRendererProps) => {
  const blocks = useMemo(() => generateBlocks(schema, elements), [schema, elements]);

  console.log('blocks', blocks, elements);

  return (
    <BlocksComponent
      Block={({ children }) => <>{children}</>}
      cells={elements as CellsMap}
      blocks={blocks}
    >
      {(Cell, cell) => <Cell {...cell} />}
    </BlocksComponent>
  );
};
