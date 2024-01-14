import { initialCaseCreationContext } from '@/pages/Entities/components/CaseCreation/context/case-creation-context/case-creation.context';
import {
  CaseCreationLogic,
  CaseCreationContext,
} from '@/pages/Entities/components/CaseCreation/context/case-creation-context/types';
import { useCallback, useMemo, useState } from 'react';

export const useCaseCreationState = () => {
  const [state, setState] = useState<
    Pick<CaseCreationContext, 'isMultipleCasesCreation' | 'isOpen'>
  >({
    isMultipleCasesCreation: initialCaseCreationContext.isMultipleCasesCreation,
    isOpen: initialCaseCreationContext.isOpen,
  });

  const toggleMultiCaseCreation = useCallback(() => {
    setState(prev => ({ ...prev, isMultipleCasesCreation: !prev.isMultipleCasesCreation }));
  }, []);

  const setIsOpen = useCallback((isOpen: boolean) => {
    setState(prev => ({ ...prev, isOpen }));
  }, []);

  const caseCreationLogic: CaseCreationLogic = useMemo(
    () => ({ toggleMultiCaseCreation, setIsOpen }),
    [toggleMultiCaseCreation, setIsOpen],
  );

  const context: CaseCreationContext = useMemo(
    () => ({ ...state, ...caseCreationLogic }),
    [state, caseCreationLogic],
  );

  return {
    context,
    state,
    api: caseCreationLogic,
  };
};
