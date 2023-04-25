import React, { FunctionComponent, PropsWithChildren } from 'react';
import { MotionScrollArea } from 'components/molecules/MotionScrollArea/MotionScrollArea';
import { motion } from 'framer-motion';

/**
 * @description To be used by {@link Subject}. Serves as a container for ${@link Subject.Info} and {@link Subject.Documents}.
 *
 * @param props
 * @param props.children - Expects {@link Subject.Info} and {@link Subject.Documents} as children.
 *
 * @see {@link Subject.Info}
 * @see {@link Subject.Documents}
 *
 * @constructor
 */
export const Content: FunctionComponent<PropsWithChildren> = ({ children }) => {
  return (
    <MotionScrollArea className="h-[calc(100vh-146px)]">
      <motion.div
        initial={{
          opacity: 0,
          y: '50px',
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{ duration: 0.5 }}
        className={`mx-2 flex flex-col space-y-3 p-1 pt-2`}
      >
        {children}
      </motion.div>
    </MotionScrollArea>
  );
};
