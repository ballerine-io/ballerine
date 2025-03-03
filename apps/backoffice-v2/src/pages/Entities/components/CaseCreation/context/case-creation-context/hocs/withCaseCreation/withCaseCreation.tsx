import { CaseCreationContextProvider } from '@/pages/Entities/components/CaseCreation/context/case-creation-context/Provider';

export const withCaseCreation = <TComponentProps extends object>(
  Component: React.ComponentType<TComponentProps>,
): React.ComponentType<TComponentProps> => {
  const Wrapper = (props: TComponentProps) => {
    return (
      <CaseCreationContextProvider>
        <Component {...props} />
      </CaseCreationContextProvider>
    );
  };

  Wrapper.displayName = `withCaseCreation(${Component.displayName})`;

  return Wrapper;
};
