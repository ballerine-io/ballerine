import { baseElements } from '@/components/organisms/UIRenderer/base-elements';
import { BlocksComponent } from '@ballerine/blocks';
import { Card } from '@ballerine/ui';
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

  return (
    <Component className={className} style={styles} data-testid="task">
      <BlocksComponent
        Block={
          // @ts-ignore
          ({ children }) => <>{children}</>
        }
        blocks={childrens}
        //@ts-ignore
        cells={baseElements}
      >
        {
          // @ts-ignore
          (Cell, cell) => (Cell ? <Cell {...cell} /> : null)
        }
      </BlocksComponent>
    </Component>
  );
};
