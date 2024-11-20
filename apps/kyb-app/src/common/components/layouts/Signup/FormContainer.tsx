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
    <div className="my-6 flex flex-col gap-4 pr-10" style={containerStyles}>
      {children}
    </div>
  );
};
