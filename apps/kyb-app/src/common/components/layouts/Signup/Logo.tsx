import { CSSProperties, FunctionComponent } from 'react';
import { useSignupLayout } from './hooks/useSignupLayout';

interface ILogoProps {
  imageSrc?: string;
  styles?: CSSProperties;
}

export const Logo: FunctionComponent<ILogoProps> = props => {
  const { themeParams } = useSignupLayout();
  const { imageSrc, styles } = themeParams?.companyLogo || props || {};

  if (!imageSrc) return null;

  return <img src={imageSrc} style={styles} />;
};
