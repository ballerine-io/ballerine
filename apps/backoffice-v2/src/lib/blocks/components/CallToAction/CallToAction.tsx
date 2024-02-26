import { AnimatePresence } from 'framer-motion';
import { ComponentProps, FunctionComponent } from 'react';
import { MotionButton } from '../../../../common/components/molecules/MotionButton/MotionButton';
import { ctw } from '../../../../common/utils/ctw/ctw';
import { ICallToActionProps } from './interfaces';

const motionButtonProps = {
  exit: { opacity: 0, transition: { duration: 0.2 } },
  initial: { y: 10, opacity: 0 },
  transition: { type: 'spring', bounce: 0.3 },
  animate: { y: 0, opacity: 1, transition: { duration: 0.2 } },
} satisfies ComponentProps<typeof MotionButton>;

export const CallToAction: FunctionComponent<ICallToActionProps> = ({ value }) => {
  return (
    <AnimatePresence>
      <MotionButton
        {...motionButtonProps}
        animate={{
          ...motionButtonProps.animate,
          opacity: value?.props?.disabled ? 0.5 : motionButtonProps.animate.opacity,
        }}
        {...value?.props}
        disabled={value?.props?.disabled}
        onClick={value?.onClick}
        className={ctw(value?.props?.className)}
      >
        {value?.text}
      </MotionButton>
    </AnimatePresence>
  );
};
