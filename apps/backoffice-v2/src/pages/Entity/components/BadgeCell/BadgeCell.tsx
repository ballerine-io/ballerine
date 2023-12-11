import { AnimatePresence } from 'framer-motion';
import { ComponentProps, ElementRef, forwardRef } from 'react';
import { MotionBadge } from '../../../../common/components/molecules/MotionBadge/MotionBadge';
import * as React from 'react';

export const BadgeCell = forwardRef<
  ElementRef<typeof MotionBadge>,
  {
    value: ComponentProps<typeof MotionBadge>['children'];
    props: ComponentProps<typeof MotionBadge>;
  }
>(({ value, props }, ref) => {
  return (
    <AnimatePresence>
      <MotionBadge {...props} ref={ref}>
        {value}
      </MotionBadge>
    </AnimatePresence>
  );
});
BadgeCell.displayName = 'BadgeCell';
