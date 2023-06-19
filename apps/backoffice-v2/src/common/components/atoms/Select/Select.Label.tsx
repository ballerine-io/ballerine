import * as React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { ctw } from '../../../utils/ctw/ctw';

export const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={ctw(
      'py-1.5 pl-8 pr-2 text-sm font-semibold text-slate-900 dark:text-slate-300',
      className,
    )}
    {...props}
  />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;
