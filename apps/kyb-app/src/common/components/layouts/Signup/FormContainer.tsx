import { CSSProperties, FunctionComponent } from 'react';
import { useSignupLayout } from './hooks/useSignupLayout';

interface IFormContainerProps {
  children: React.ReactNode;
  styles?: CSSProperties;
}

export const FormContainer: FunctionComponent<IFormContainerProps> = ({ children }) => {
  const { themeParams } = useSignupLayout();
  const { containerStyles } = themeParams?.form || {};

  return (
    <div className="my-6 flex flex-col gap-4 pr-10" style={containerStyles}>
      {children}
    </div>
  );
};
