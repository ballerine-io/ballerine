import { Button, ButtonProps } from '@/components/atoms';
import clsx from 'clsx';
import { Loader2 } from 'lucide-react';
import { forwardRef } from 'react';

export interface SubmitButtonProps extends ButtonProps {
  isLoading?: boolean;
  loaderClassName?: string;
}

export const SubmitButton = forwardRef<HTMLButtonElement, SubmitButtonProps>(
  (
    { isLoading, children, className, loaderClassName, type = 'submit', ...restButtonProps },
    ref,
  ) => {
    return (
      <Button
        type={type}
        ref={ref}
        className={clsx(className, 'relative', { 'pointer-events-none': isLoading })}
        {...restButtonProps}
      >
        <span className={clsx({ invisible: isLoading })}>{children}</span>
        {isLoading ? (
          <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center">
            <Loader2
              className={clsx('text-primary-foreground animate-spin text-sm', loaderClassName)}
            />
          </div>
        ) : null}
      </Button>
    );
  },
);
