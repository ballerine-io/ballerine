import { AnyChildren } from '@ballerine/ui';
import { motion } from 'framer-motion';

interface Props {
  children: AnyChildren;
}

export const Content = ({ children }: Props) => {
  return (
    <motion.div
      className="text-secondary-foreground h-full w-[100%] overflow-auto p-4"
      style={{
        background: 'var(--secondary)',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      {children}
    </motion.div>
  );
};
