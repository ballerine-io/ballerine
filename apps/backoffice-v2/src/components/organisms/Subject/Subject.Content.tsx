import React, { FunctionComponent, PropsWithChildren } from 'react';
import { motion } from 'framer-motion';
import { ScrollArea } from '@/components/atoms/ScrollArea/ScrollArea';

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
    <ScrollArea className="h-[calc(100vh-146px)]">
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
        className={`grid grid-cols-2 pl-10 pt-2`}
      >
        {children}
      </motion.div>
    </ScrollArea>
  );
};
