import { motion } from 'framer-motion';
import { FunctionComponent, useState } from 'react';
import { useSignupLayout } from './hooks/useSignupLayout';

interface IBackgroundProps {
  imageSrc?: string;
  styles?: React.CSSProperties;
}

export const Background: FunctionComponent<IBackgroundProps> = props => {
  const { themeParams } = useSignupLayout();
  const { imageSrc, styles } = { ...props, ...themeParams?.background };
  const [isLoaded, setIsLoaded] = useState(false);

  if (!imageSrc) return null;

  return (
    <motion.div className="h-screen min-w-[62%] flex-1 overflow-hidden">
      <motion.img
        src={imageSrc}
        className="h-full w-full object-cover"
        style={styles}
        initial={{ opacity: 0, scale: 1.2 }}
        animate={isLoaded ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.2 }}
        exit={{ opacity: 0 }}
        transition={{
          duration: 0.6,
          ease: 'easeOut',
        }}
        onLoad={() => setIsLoaded(true)}
      />
    </motion.div>
  );
};
