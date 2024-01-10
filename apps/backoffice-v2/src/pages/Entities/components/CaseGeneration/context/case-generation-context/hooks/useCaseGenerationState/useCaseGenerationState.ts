import { initialCaseGenerationContext } from '@/pages/Entities/components/CaseGeneration/context/case-generation-context/case-generation.context';
import {
  CaseGenerationApi,
  CaseGenerationContext,
} from '@/pages/Entities/components/CaseGeneration/context/case-generation-context/types';
import { useCallback, useMemo, useState } from 'react';

export const useCaseGenerationAPI = () => {
  const [state, setState] = useState<
    Pick<CaseGenerationContext, 'isMultipleCasesCreation' | 'isOpen'>
  >({
    isMultipleCasesCreation: initialCaseGenerationContext.isMultipleCasesCreation,
    isOpen: initialCaseGenerationContext.isOpen,
  });

  const toggleMultiCaseCreation = useCallback(() => {
    setState(prev => ({ ...prev, isMultipleCasesCreation: !prev.isMultipleCasesCreation }));
  }, []);

  const setOpen = useCallback((open: boolean) => {
    setState(prev => ({ ...prev, isOpen: open }));
  }, []);

  const caseGenerationApi: CaseGenerationApi = useMemo(
    () => ({ toggleMultiCaseCreation, setOpen }),
    [toggleMultiCaseCreation, setOpen],
  );

  const context: CaseGenerationContext = useMemo(
    () => ({ ...state, ...caseGenerationApi }),
    [state, caseGenerationApi],
  );

  return {
    context,
    state,
    api: caseGenerationApi,
  };
};
