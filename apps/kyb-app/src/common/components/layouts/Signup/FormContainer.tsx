import { motion } from 'framer-motion';
import { CSSProperties, FunctionComponent } from 'react';
import { useSignupLayout } from './hooks/useSignupLayout';

interface IFormContainerProps {
  children: React.ReactNode;
  containerStyles?: CSSProperties;
}

export const FormContainer: FunctionComponent<IFormContainerProps> = ({
  children,
  containerStyles: _containerStyles,
}) => {
  const { themeParams } = useSignupLayout();
  const { containerStyles } = {
    ...themeParams?.form,
    ...{ containerStyles: _containerStyles || themeParams?.form?.containerStyles },
  };

  return (
    <motion.div
      className="my-6 flex flex-col gap-4 pr-10"
      style={containerStyles}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      {children}
    </motion.div>
  );
};
