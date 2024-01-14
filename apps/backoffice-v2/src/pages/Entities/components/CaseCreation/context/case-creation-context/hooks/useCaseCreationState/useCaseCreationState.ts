import { initialCaseCreationContext } from '@/pages/Entities/components/CaseCreation/context/case-creation-context/case-creation.context';
import {
  CaseCreationApi,
  CaseGenerationContext,
} from '@/pages/Entities/components/CaseCreation/context/case-creation-context/types';
import { useCallback, useMemo, useState } from 'react';

export const useCaseCreationState = () => {
  const [state, setState] = useState<
    Pick<CaseGenerationContext, 'isMultipleCasesCreation' | 'isOpen'>
  >({
    isMultipleCasesCreation: initialCaseCreationContext.isMultipleCasesCreation,
    isOpen: initialCaseCreationContext.isOpen,
  });

  const toggleMultiCaseCreation = useCallback(() => {
    setState(prev => ({ ...prev, isMultipleCasesCreation: !prev.isMultipleCasesCreation }));
  }, []);

  const setOpen = useCallback((open: boolean) => {
    setState(prev => ({ ...prev, isOpen: open }));
  }, []);

  const caseCreationApi: CaseCreationApi = useMemo(
    () => ({ toggleMultiCaseCreation, setOpen }),
    [toggleMultiCaseCreation, setOpen],
  );

  const context: CaseGenerationContext = useMemo(
    () => ({ ...state, ...caseCreationApi }),
    [state, caseCreationApi],
  );

  return {
    context,
    state,
    api: caseCreationApi,
  };
};
