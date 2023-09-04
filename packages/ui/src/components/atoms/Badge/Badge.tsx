import * as React from 'react';
import { ctw } from '@utils/ctw';
import { cva, type VariantProps } from 'class-variance-authority';

const badgeVariants = cva(
  'inline-flex px-3 items-center justify-center rounded-full cursor-default transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 max-h-[24px]',
  {
    variants: {
      variant: {
        outline: 'text-foreground',
        default: 'bg-primary text-primary',
        secondary: 'bg-secondary text-secondary',
        info: 'bg-info/20 text-info',
        success: 'bg-success/20 text-success',
        warning: 'bg-warning/20 text-warning',
        destructive: 'bg-destructive/20 text-destructive',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export type BadgeVariantProps = VariantProps<typeof badgeVariants>;

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, BadgeVariantProps {
  asChild?: boolean;
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, children, ...props }, ref) => (
    <div className={ctw(badgeVariants({ variant }), className)} {...props} ref={ref}>
      {children}
    </div>
  ),
);

Badge.displayName = 'Badge';

export { Badge, badgeVariants };
