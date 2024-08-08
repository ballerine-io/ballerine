import * as React from 'react';
import { ctw } from '@/common/utils/ctw';
import { cva, type VariantProps } from 'class-variance-authority';

const badgeVariants = cva(
  'flex inline-flex items-center justify-center rounded-full cursor-default transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 px-3 py-1 gap-1',
  {
    variants: {
      variant: {
        outline: 'text-foreground',
        primary: 'bg-primary text-primary-foreground',
        secondary: 'bg-secondary text-secondary-foreground',
        info: 'bg-info/20 text-info',
        success: 'bg-success/20 text-success',
        warning: 'bg-warning/20 text-warning',
        destructive: 'bg-destructive/20 text-destructive',
        violet: 'bg-violet/20 text-violet',
      },
    },
    defaultVariants: {
      variant: 'primary',
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
