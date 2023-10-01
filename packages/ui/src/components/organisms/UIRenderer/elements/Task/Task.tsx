import { BlocksComponent } from '@ballerine/blocks';
import { Card } from '@components/atoms';
import { baseElements } from '@components/organisms/UIRenderer/base-elements';
import { ctw } from '@utils/ctw';
import { CSSProperties } from 'react';

export interface TaskOptions {
  styles?: CSSProperties;
  className?: string;
  variant?: 'wrapper' | 'card';
}

export interface TaskProps {
  options?: TaskOptions;
  childrens: any;
}

export const Task = ({ options = {}, childrens, ...rest }: TaskProps) => {
  const { styles, className, variant } = options;

  const Component = variant === 'wrapper' ? Card : 'div';

  console.log('childrens', childrens);

  return (
    <Component className={ctw(className)} style={styles} data-test-id="task">
      <BlocksComponent
        Block={({ children }) => <>{children}</>}
        blocks={childrens}
        cells={baseElements}
      >
        {(Cell, cell) => (Cell ? <Cell {...cell} /> : null)}
      </BlocksComponent>
    </Component>
  );
};
