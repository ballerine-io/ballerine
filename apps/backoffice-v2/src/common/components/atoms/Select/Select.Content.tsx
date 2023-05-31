import * as React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { ctw } from '../../../utils/ctw/ctw';

export const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={ctw(
        'relative z-50 min-w-[8rem] overflow-hidden rounded-md border border-slate-100 bg-white text-slate-700 shadow-md animate-in fade-in-80 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-400',
        className,
      )}
      {...props}
    >
      <SelectPrimitive.Viewport className="p-1">{children}</SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;
