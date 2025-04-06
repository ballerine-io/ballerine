import { AnimatePresence } from 'framer-motion';
import { ComponentProps, ElementRef, forwardRef } from 'react';
import { MotionBadge } from '../../../../common/components/molecules/MotionBadge/MotionBadge';

export const Badge = forwardRef<ElementRef<typeof MotionBadge>, ComponentProps<typeof MotionBadge>>(
  ({ children, props }, ref) => {
    return (
      <AnimatePresence>
        <MotionBadge {...props} ref={ref}>
          {children}
        </MotionBadge>
      </AnimatePresence>
    );
  },
);

Badge.displayName = 'Badge';

export const BadgeCell = forwardRef<
  ElementRef<typeof Badge>,
  {
    value: ComponentProps<typeof Badge>['children'];
    props: ComponentProps<typeof Badge>;
  }
>(({ value, props }, ref) => {
  return (
    <Badge {...props} ref={ref}>
      {value}
    </Badge>
  );
});

BadgeCell.displayName = 'BadgeCell';
