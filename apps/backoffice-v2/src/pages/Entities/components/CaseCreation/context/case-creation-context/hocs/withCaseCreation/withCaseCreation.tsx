import { CaseCreationContextProvider } from '@/pages/Entities/components/CaseCreation/context/case-creation-context/Provider';

export function withCaseCreation<TComponentProps extends object>(
  Component: React.ComponentType<TComponentProps>,
): React.ComponentType<TComponentProps> {
  function Wrapper(props: TComponentProps) {
    return (
      <CaseCreationContextProvider>
        <Component {...props} />
      </CaseCreationContextProvider>
    );
  }

  Wrapper.displayName = `withCaseCreation(${Component.displayName})`;

  return Wrapper;
}
