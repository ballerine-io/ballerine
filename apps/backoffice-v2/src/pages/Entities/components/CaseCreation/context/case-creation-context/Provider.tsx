import { caseCreationContext } from '@/pages/Entities/components/CaseCreation/context/case-creation-context/case-creation.context';
import { useCaseCreationState } from '@/pages/Entities/components/CaseCreation/context/case-creation-context/hooks/useCaseCreationState';
import { AnyChildren } from '@ballerine/ui';
import { FunctionComponent } from 'react';

const { Provider } = caseCreationContext;

export interface CaseGenerationProviderProps {
  children: AnyChildren;
}

export const CaseGenerationContextProvider: FunctionComponent<CaseGenerationProviderProps> = ({
  children,
}) => {
  const { context } = useCaseCreationState();

  return <Provider value={context}>{children}</Provider>;
};
