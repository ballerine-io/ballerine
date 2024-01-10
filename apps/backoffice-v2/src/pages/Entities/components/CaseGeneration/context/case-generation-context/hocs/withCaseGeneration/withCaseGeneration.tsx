import { CaseGenerationContextProvider } from '@/pages/Entities/components/CaseGeneration/context/case-generation-context/Provider';

export function withCaseGeneration<TComponentProps extends object>(
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
