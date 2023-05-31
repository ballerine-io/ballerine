import * as React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { ctw } from '../../../utils/ctw/ctw';

export const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={ctw('-mx-1 my-1 h-px bg-slate-100 dark:bg-slate-700', className)}
    {...props}
  />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;
