import { useUIRendererContext } from '@/components/organisms/UIRenderer/hooks/useUIRendererContext/useUIRendererContext';
import { BlocksComponent } from '@ballerine/blocks';
import { ctw } from '@ballerine/ui';
import chunk from 'lodash/chunk';
import { CSSProperties, useMemo } from 'react';

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
        blocks={childrens}
        //@ts-ignore
        cells={elements}
      >
        {
          // @ts-ignore
          (Cell, cell) => (Cell ? <Cell {...cell} /> : null)
        }
      </BlocksComponent>
    ));
  }, [columns, _childrens, elements]);

  return (
    <div
      className={ctw('grid', className, {
        'justify-start': align === 'left',
        'justify-end': align === 'right',
      })}
      style={styles}
    >
      {grid}
    </div>
  );
};
