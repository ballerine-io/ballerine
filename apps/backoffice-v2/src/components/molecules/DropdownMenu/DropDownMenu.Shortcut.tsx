import * as React from 'react';
import { ctw } from '../../../utils/ctw/ctw';

export const DropdownMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span className={ctw('ml-auto text-xs tracking-widest text-slate-500', className)} {...props} />
  );
};
DropdownMenuShortcut.displayName = 'DropdownMenuShortcut';
