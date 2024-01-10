import { caseGenerationContext } from '@/pages/Entities/components/CaseGeneration/context/case-generation-context/case-generation.context';
import { useContext } from 'react';

export const useCaseGenerationContext = () => useContext(caseGenerationContext);
