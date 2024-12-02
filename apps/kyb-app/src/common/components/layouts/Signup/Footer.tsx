import DOMPurify from 'dompurify';
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
    <div
      className="font-inter text-base text-[#94A3B8]"
      style={styles}
      dangerouslySetInnerHTML={{ __html: DOMPurify(window).sanitize(rawHtml) }}
    />
  );
};
