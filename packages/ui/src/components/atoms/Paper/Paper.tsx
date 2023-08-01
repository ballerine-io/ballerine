import { AnyChildren } from '@common/types';
import clsx from 'clsx';
import { forwardRef } from 'react';

export interface PaperProps {
  wrapperClassName?: string;
  className?: string;
  children: AnyChildren;
}

export const Paper = forwardRef(
  (
    { wrapperClassName, className, children, ...restProps }: PaperProps,
    ref: React.ForwardRefExoticComponent<HTMLDivElement>,
  ) => {
    return (
      <div className={wrapperClassName} ref={ref}>
        <div
          {...restProps}
          className={clsx('bg-card text-card-foreground rounded-lg border shadow-sm', className)}
        >
          {children}
        </div>
      </div>
    );
  },
);
