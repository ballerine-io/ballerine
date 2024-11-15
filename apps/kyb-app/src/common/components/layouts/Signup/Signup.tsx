import { ITheme } from '@/common/types/settings';
import { AnimatePresence, motion } from 'motion/react';
import { FunctionComponent } from 'react';
import { SignupLayoutProvider } from './context/SignupLayoutProvider';

interface ISignupProps {
  children: React.ReactNode;
  themeParams?: NonNullable<ITheme['signup']>;
}

export const Signup: FunctionComponent<ISignupProps> = ({ children, themeParams }) => {
  return (
    <SignupLayoutProvider themeParams={themeParams}>
      <AnimatePresence mode="wait">
        <motion.div
          className="flex h-full min-h-screen w-full flex-row flex-nowrap"
          exit={{
            opacity: 0,
            transition: {
              duration: 5,
              ease: 'easeInOut',
            },
          }}
          initial={{ opacity: 1 }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </SignupLayoutProvider>
  );
};
