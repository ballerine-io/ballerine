import { CSSProperties, useMemo } from 'react';
import chunk from 'lodash/chunk';
import { BlocksComponent } from '@ballerine/blocks';
import { baseElements } from '@app/components/organisms/UIRenderer/base-elements';
import { Column } from '@app/components/organisms/UIRenderer/elements/Cell/Column';

export interface CellOptions {
  columns?: number;
  styles?: CSSProperties;
  className?: string;
}

export interface CellProps {
  options: CellOptions;
  childrens: any[];
}

export const Cell = ({ options = {}, childrens: _childrens = [] }: CellProps) => {
  const { columns = 1, className, styles } = options;

  const grid = useMemo(() => {
    const gridItems = chunk(_childrens, Math.floor(_childrens.length / columns));

    return gridItems.map((childrens, index) => (
      <Column key={`column-${index}`}>
        <BlocksComponent
          Block={({ children }) => <>{children}</>}
          blocks={childrens}
          //@ts-ignore
          cells={baseElements}
        >
          {(Cell, cell) => (Cell ? <Cell {...cell} /> : null)}
        </BlocksComponent>
      </Column>
    ));
  }, [columns, _childrens]);

  return (
    <div className={'flex ' + className} style={styles}>
      {grid}
    </div>
  );
};
