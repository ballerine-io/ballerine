import { CaseCreationContext } from '@/pages/Entities/components/CaseCreation/context/case-creation-context/types';
import { createContext } from 'react';

export const initialCaseCreationContext = {
  isMultipleCasesCreation: false,
  isOpen: false,
} as CaseCreationContext;

export const caseCreationContext = createContext<CaseCreationContext>(initialCaseCreationContext);
