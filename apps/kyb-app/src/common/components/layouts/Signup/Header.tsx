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
    <div className="flex flex-col gap-6 pb-6" style={containerStyles}>
      <h1 className="text-2xl font-bold">{headingText}</h1>
      <p className="text-base">{subheadingText}</p>
    </div>
  );
};
