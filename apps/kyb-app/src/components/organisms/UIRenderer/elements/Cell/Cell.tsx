import { CSSProperties, useMemo } from 'react';
import chunk from 'lodash/chunk';
import { BlocksComponent } from '@ballerine/blocks';
import { Column } from '@app/components/organisms/UIRenderer/elements/Cell/Column';
import { useUIRendererContext } from '@app/components/organisms/UIRenderer/hooks/useUIRendererContext/useUIRendererContext';
import clsx from 'clsx';
import { Fragment } from 'react';

export interface CellOptions {
  columns?: number;
  styles?: CSSProperties;
  className?: string;
  align?: 'left' | 'right';
}

export interface CellProps {
  options: CellOptions;
  childrens: any[];
}

export const Cell = ({ options = {}, childrens: _childrens = [] }: CellProps) => {
  const { elements } = useUIRendererContext();
  const { columns = 1, className = '', styles, align } = options;

  const grid = useMemo(() => {
    const gridItems = chunk(_childrens, Math.floor(_childrens.length / columns));

    return gridItems.map((childrens, index) => (
      <BlocksComponent
        key={`column-${index}`}
        Block={Fragment as any}
        blocks={childrens}
        //@ts-ignore
        cells={elements}
      >
        {(Cell, cell) => (Cell ? <Cell {...cell} /> : null)}
      </BlocksComponent>
    ));
  }, [columns, _childrens, elements]);

  return (
    <div
      className={clsx('grid' + className, {
        'justify-start': align === 'left',
        'justify-end': align === 'right',
      })}
      style={styles}
    >
      {grid}
    </div>
  );
};
