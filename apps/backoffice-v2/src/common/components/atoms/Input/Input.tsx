import * as React from 'react';
import { forwardRef } from 'react';
import { ctw } from '../../../utils/ctw/ctw';
import { TInputProps } from './types';

export const Input = forwardRef<HTMLInputElement, TInputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={ctw(
          'flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className,
          {
            'h-4 w-4': type === 'checkbox',
          },
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';
