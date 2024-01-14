import { CaseGenerationContext } from '@/pages/Entities/components/CaseCreation/context/case-creation-context/types';
import { createContext } from 'react';

export const initialCaseCreationContext = {
  isMultipleCasesCreation: false,
  isOpen: false,
} as CaseGenerationContext;

export const caseCreationContext = createContext<CaseGenerationContext>(initialCaseCreationContext);
