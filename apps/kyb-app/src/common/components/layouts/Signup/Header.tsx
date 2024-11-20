import { motion } from 'framer-motion';
import { CSSProperties, FunctionComponent } from 'react';
import { useSignupLayout } from './hooks/useSignupLayout';

interface IHeaderProps {
  headingText?: string;
  subheadingText?: string;
  containerStyles?: CSSProperties;
}

export const Header: FunctionComponent<IHeaderProps> = props => {
  const { themeParams } = useSignupLayout();
  const { headingText, subheadingText, containerStyles } = {
    ...props,
    ...themeParams?.header,
  };

  return (
    <motion.div className="flex flex-col gap-6 pb-6" style={containerStyles}>
      <motion.h1
        className="text-2xl font-bold"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        {headingText}
      </motion.h1>
      <motion.p
        className="text-base"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.3 }}
      >
        {subheadingText}
      </motion.p>
    </motion.div>
  );
};
