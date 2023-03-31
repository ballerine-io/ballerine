import React, { FunctionComponent } from 'react';
import { Button, ButtonProps } from '@/components/atoms/Button';
import { MoreVertical } from 'lucide-react';

/**
 * @description Wraps {@link MoreVertical} with a {@link Button} component and applies default
 * styling.
 * @param props
 * @constructor
 */
export const EllipsisButton: FunctionComponent<ButtonProps<'button'>> = props => {
  return (
    <Button size={`lg`} variant={`default`} shape={'square'} {...props}>
      <MoreVertical />
    </Button>
  );
};
