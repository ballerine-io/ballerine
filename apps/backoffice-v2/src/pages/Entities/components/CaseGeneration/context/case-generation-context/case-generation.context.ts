import { CaseGenerationContext } from '@/pages/Entities/components/CaseGeneration/context/case-generation-context/types';
import { createContext } from 'react';

export const initialCaseGenerationContext = {
  isMultipleCasesCreation: false,
  isOpen: false,
} as CaseGenerationContext;

export const caseGenerationContext = createContext<CaseGenerationContext>(
  initialCaseGenerationContext,
);
