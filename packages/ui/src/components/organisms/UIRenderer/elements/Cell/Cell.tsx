import { AnyChildren } from '@common/types';
import { ctw } from '@utils/ctw';
import { CSSProperties, useMemo } from 'react';
import chunk from 'lodash/chunk';
import { Column } from '@components/organisms/UIRenderer/elements/Cell/Column';
import { BlocksComponent } from '@ballerine/blocks';
import { baseElements } from '@components/organisms/UIRenderer/base-elements';

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
          cells={baseElements}
        >
          {(Cell, cell) => (Cell ? <Cell {...cell} /> : null)}
        </BlocksComponent>
      </Column>
    ));
  }, [columns, _childrens]);

  return (
    <div className={ctw('flex', className)} style={styles}>
      {grid}
    </div>
  );
};
