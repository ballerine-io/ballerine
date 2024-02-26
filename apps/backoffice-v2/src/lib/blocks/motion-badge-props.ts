import { ComponentProps } from 'react';
import { MotionBadge } from '../../common/components/molecules/MotionBadge/MotionBadge';

export const motionBadgeProps = {
  exit: { opacity: 0, transition: { duration: 0.2 } },
  initial: { y: 10, opacity: 0 },
  transition: { type: 'spring', bounce: 0.3 },
  animate: { y: 0, opacity: 1, transition: { duration: 0.2 } },
} satisfies ComponentProps<typeof MotionBadge>;
