import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, VariantProps } from 'class-variance-authority';
import { ctw } from '../../../utils/ctw/ctw';

export const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-30 disabled:pointer-events-none disabled:shadow-none ring-offset-background',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive:
          'bg-destructive font-semibold text-white hover:bg-destructive/90 disabled:bg-destructive/80 shadow-[0_4px_4px_0_rgba(236,86,86,0.15)]',
        success:
          'bg-success text-white font-semibold hover:bg-success/90 disabled:bg-success/80 shadow-[0_4px_4px_0_rgba(0,189,89,0.15)]',
        warning:
          'bg-warning text-primary-foreground font-semibold hover:bg-warning/80 shadow-[0_4px_4px_0_rgba(255,168,105,0.15)] disabled:bg-warning/80',
        outline: 'border border-input hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        status: 'focus-visible:ring-0 focus-visible:ring-offset-0 focus:!bg-[#F4F6FD] bg-[#F4F6FD]',
        link: 'underline-offset-4 hover:underline text-primary',
        'wp-primary':
          'bg-wp-primary text-wp-primary-foreground hover:bg-wp-primary/90 disabled:text-wp-primary-foreground disabled:bg-wp-primary',
        'wp-outline':
          'border border-wp-primary text-wp-primary hover:bg-wp-primary hover:text-wp-primary-foreground',
      },
      size: {
        default: 'h-10 py-2 px-4',
        sm: 'h-9 px-3 rounded-md',
        md: 'h-9 px-4 py-2 rounded-lg min-w-[100px]',
        lg: 'h-11 px-8 rounded-md',
        wide: 'h-8 px-5 py-2 rounded-lg min-w-[100px]',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';

    return (
      <Comp className={ctw(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);

Button.displayName = 'Button';
