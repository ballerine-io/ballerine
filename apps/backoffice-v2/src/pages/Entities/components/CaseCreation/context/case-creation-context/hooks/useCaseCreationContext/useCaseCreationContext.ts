import { caseCreationContext } from '@/pages/Entities/components/CaseCreation/context/case-creation-context/case-creation.context';
import { useContext } from 'react';

export const useCaseCreationContext = () => useContext(caseCreationContext);
