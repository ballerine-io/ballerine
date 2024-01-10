import { caseGenerationContext } from '@/pages/Entities/components/CaseGeneration/context/case-generation-context/case-generation.context';
import { useCaseGenerationAPI } from '@/pages/Entities/components/CaseGeneration/context/case-generation-context/hooks/useCaseGenerationState';
import { AnyChildren } from '@ballerine/ui';
import { FunctionComponent } from 'react';

const { Provider } = caseGenerationContext;

export interface CaseGenerationProviderProps {
  children: AnyChildren;
}

export const CaseGenerationContextProvider: FunctionComponent<CaseGenerationProviderProps> = ({
  children,
}) => {
  const { context } = useCaseGenerationAPI();

  return <Provider value={context}>{children}</Provider>;
};
