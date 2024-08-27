import { createTestId, ctw, IRendererComponent } from '@ballerine/ui';
import { CSSProperties } from 'react';

export const Container: IRendererComponent<
  {},
  {
    styles?: CSSProperties;
    className?: string;
  }
> = ({ children, stack, definition, options }) => {
  const { styles, className } = options || {};

  return (
    <div
      className={ctw('grid' + className)}
      style={styles}
      data-test-id={createTestId(definition, stack)}
    >
      {children}
    </div>
  );
};
