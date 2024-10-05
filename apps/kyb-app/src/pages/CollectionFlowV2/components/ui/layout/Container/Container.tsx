import { IUIComponentProps } from '@/pages/CollectionFlowV2/types';
import { createTestId, ctw } from '@ballerine/ui';
import { CSSProperties, FunctionComponent } from 'react';

export const Container: FunctionComponent<
  IUIComponentProps<{
    styles?: CSSProperties;
    className?: string;
  }>
> = ({ children, stack, definition, options }) => {
  const { styles, className } = options || {};

  return (
    <div
      className={ctw('grid', className)}
      style={styles}
      data-test-id={createTestId(definition, stack)}
    >
      {children}
    </div>
  );
};
