import * as React from 'react';
import { LabelProps, Root } from '@radix-ui/react-label';
import { ctw } from '@/utils/ctw';

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(({ className, ...props }, ref) => (
  <Root
    className={ctw(
      'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
      className,
    )}
    ref={ref}
    {...props}
  />
));

export { Label };
