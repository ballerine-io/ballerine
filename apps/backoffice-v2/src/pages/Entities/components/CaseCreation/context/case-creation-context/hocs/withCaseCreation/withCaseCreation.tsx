import { CaseGenerationContextProvider } from '@/pages/Entities/components/CaseCreation/context/case-creation-context/Provider';

export function withCaseCreation<TComponentProps extends object>(
  Component: React.ComponentType<TComponentProps>,
): React.ComponentType<TComponentProps> {
  function Wrapper(props: TComponentProps) {
    return (
      <CaseGenerationContextProvider>
        <Component {...props} />
      </CaseGenerationContextProvider>
    );
  }

  Wrapper.displayName = `withCaseGeneration(${Component.displayName})`;

  return Wrapper;
}
