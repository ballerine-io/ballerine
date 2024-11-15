import { motion } from 'motion/react';
import { CSSProperties, FunctionComponent, useState } from 'react';
import { useSignupLayout } from './hooks/useSignupLayout';

interface ILogoProps {
  imageSrc?: string;
  styles?: CSSProperties;
}

export const Logo: FunctionComponent<ILogoProps> = props => {
  const { themeParams } = useSignupLayout();
  const { imageSrc, styles } = { ...props, ...themeParams?.companyLogo };
  const [isLoaded, setIsLoaded] = useState(false);

  if (!imageSrc) return null;

  return (
    <motion.img
      src={imageSrc}
      style={styles}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isLoaded ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.5 }}
      onLoad={() => setIsLoaded(true)}
    />
  );
};
