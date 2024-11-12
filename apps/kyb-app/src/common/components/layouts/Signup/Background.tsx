import { FunctionComponent } from 'react';
import { useSignupLayout } from './hooks/useSignupLayout';

interface IBackgroundProps {
  imageSrc?: string;
  styles?: React.CSSProperties;
}

export const Background: FunctionComponent<IBackgroundProps> = props => {
  const { themeParams } = useSignupLayout();
  const { imageSrc, styles } = themeParams?.background || props || ({} as IBackgroundProps);

  if (!imageSrc) return null;

  return (
    <div
      className="h-full min-w-[62%] flex-1"
      style={{
        ...styles,
        backgroundImage: `url(${imageSrc})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    ></div>
  );
};
