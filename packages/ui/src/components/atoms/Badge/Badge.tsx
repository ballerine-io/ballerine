import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { ctw } from '@utils/ctw';

const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-full cursor-default transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground',
        success: 'bg-success text-primary-foreground',
        warning: 'bg-warning text-primary-foreground',
        destructive: 'bg-destructive text-destructive-foreground',
        outline: 'border border-input bg-background hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground',
        ghost: 'hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-[28px] px-4 py-2',
        sm: 'h-7 px-3',
        lg: 'h-10 px-8',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export type BadgeVariantProps = VariantProps<typeof badgeVariants>;

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, BadgeVariantProps {
  asChild?: boolean;
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ children, variant, className, size, asChild = false, ...props }, ref) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const Comp = asChild ? Slot : 'div';

    return (
      <Comp className={ctw(badgeVariants({ variant, size, className }))} ref={ref} {...props}>
        {children}
      </Comp>
    );
  },
);
Badge.displayName = 'Badge';

export { Badge, badgeVariants };
