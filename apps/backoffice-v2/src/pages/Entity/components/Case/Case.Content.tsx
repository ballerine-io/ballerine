import React, { FunctionComponent, PropsWithChildren } from 'react';
import { MotionScrollArea } from '../../../../common/components/molecules/MotionScrollArea/MotionScrollArea';
import { motion } from 'framer-motion';

/**
 * @description To be used by {@link Case}. Serves as a container for ${@link Case.Info} and {@link Case.Documents}.
 *
 * @param props
 * @param props.children - Expects {@link Case.Info} and {@link Case.Documents} as children.
 *
 * @see {@link Case.Info}
 * @see {@link Case.Documents}
 *
 * @constructor
 */
export const Content: FunctionComponent<PropsWithChildren> = ({ children }) => {
  return (
    <MotionScrollArea className="h-[calc(100vh-186px)]">
      <motion.div
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{ duration: 0.3 }}
        className={`mx-2 flex flex-col space-y-3 p-1 pt-2`}
      >
        {children}
      </motion.div>
    </MotionScrollArea>
  );
};
