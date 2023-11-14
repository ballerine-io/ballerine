'use client';

import * as React from 'react';
import { Root, LabelProps } from '@radix-ui/react-label';
import { ctw } from '@/utils/ctw';

const Label = React.forwardRef(
  ({ className, ...props }: LabelProps, ref: React.RefObject<HTMLLabelElement>) => (
    <Root
      className={ctw(
        'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
);

export { Label };
