import { FunctionComponent } from 'react';
import { useSignupLayout } from './hooks/useSignupLayout';

interface IHeaderProps {
  headingText: string;
  subheadingText?: string;
}

export const Header: FunctionComponent<IHeaderProps> = props => {
  const { themeParams } = useSignupLayout();
  const { headingText, subheadingText } = themeParams?.header || props || {};

  return (
    <div className="flex flex-col gap-6 pb-6">
      <h1 className="text-2xl font-bold">{headingText}</h1>
      <p className="text-base">{subheadingText}</p>
    </div>
  );
};
