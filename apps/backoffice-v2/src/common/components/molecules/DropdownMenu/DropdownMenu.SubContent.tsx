import * as React from 'react';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { ctw } from '../../../utils/ctw/ctw';

export const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={ctw(
      'z-50 min-w-[8rem] overflow-hidden rounded-md border border-slate-100 bg-white p-1 text-slate-700 shadow-md animate-in slide-in-from-left-1 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-400',
      className,
    )}
    {...props}
  />
));
DropdownMenuSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName;
