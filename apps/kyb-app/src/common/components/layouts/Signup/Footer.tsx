import DOMPurify from 'dompurify';
import { motion } from 'motion/react';
import { CSSProperties, FunctionComponent } from 'react';
import { useSignupLayout } from './hooks/useSignupLayout';

interface IFooterProps {
  rawHtml?: string;
  styles?: CSSProperties;
}

export const Footer: FunctionComponent<IFooterProps> = props => {
  const { themeParams } = useSignupLayout();
  const { rawHtml, styles } = { ...themeParams?.footer, ...props };

  if (!rawHtml) return null;

  return (
    <motion.div
      className="font-inter text-base text-[#94A3B8]"
      style={styles}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      dangerouslySetInnerHTML={{ __html: DOMPurify(window).sanitize(rawHtml) }}
    />
  );
};
