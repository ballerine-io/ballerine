import * as React from 'react';
import { ctw } from '@/common/utils/ctw/ctw';

interface ResizeProps extends React.HTMLAttributes<HTMLDivElement> {
  isResizing?: boolean;
}

export const ResizeHandle = React.forwardRef<HTMLDivElement, ResizeProps>(
  ({ className, isResizing = false, ...props }, ref) => {
    return (
      <div
        className={ctw(
          'absolute top-1/2 h-10 max-h-full w-1.5 -translate-y-1/2 cursor-col-resize rounded border border-solid border-[var(--mt-transparent-foreground)] bg-[var(--mt-bg-secondary)] p-px transition-all',
          'opacity-0 [backdrop-filter:saturate(1.8)_blur(20px)]',
          {
            'opacity-80': isResizing,
            'group-hover/node-image:opacity-80': !isResizing,
          },
          'before:absolute before:-inset-x-1 before:inset-y-0',
          className,
        )}
        ref={ref}
        {...props}
      ></div>
    );
  },
);

ResizeHandle.displayName = 'ResizeHandle';
