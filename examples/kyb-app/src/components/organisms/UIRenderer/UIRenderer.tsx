import { baseElements } from '@app/components/organisms/UIRenderer/base-elements';
import { ElementsMap } from '@app/components/organisms/UIRenderer/types/elements.types';
import { generateBlocks } from '@app/components/organisms/UIRenderer/utils/generateBlocks';
import { UIElement } from '@app/domains/collection-flow';
import { BlocksComponent, CellsMap } from '@ballerine/blocks';
import { AnyObject } from '@ballerine/ui';
import { useMemo } from 'react';

export interface UIRendererProps {
  schema: UIElement<AnyObject>[];
  elements?: ElementsMap;
}

export const UIRenderer = ({ schema, elements = baseElements }: UIRendererProps) => {
  //@ts-ignore
  const blocks = useMemo(() => generateBlocks(schema, elements) as any[], [schema, elements]);

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
