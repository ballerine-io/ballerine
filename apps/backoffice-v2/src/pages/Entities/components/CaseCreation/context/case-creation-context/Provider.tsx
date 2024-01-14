import { caseCreationContext } from '@/pages/Entities/components/CaseCreation/context/case-creation-context/case-creation.context';
import { useCaseCreationState } from '@/pages/Entities/components/CaseCreation/context/case-creation-context/hooks/useCaseCreationState';
import { AnyChildren } from '@ballerine/ui';
import { FunctionComponent } from 'react';

const { Provider } = caseCreationContext;

export interface CaseCreationProviderProps {
  children: AnyChildren;
}

export const CaseCreationContextProvider: FunctionComponent<CaseCreationProviderProps> = ({
  children,
}) => {
  const { context } = useCaseCreationState();

  return <Provider value={context}>{children}</Provider>;
};
