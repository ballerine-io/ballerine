import { titleCase } from 'string-ts';

import { useCustomerQuery } from '@/domains/customer/hooks/queries/useCustomerQuery/useCustomerQuery';
import { useCaseCreationWorkflowDefinition } from '@/pages/Entities/components/CaseCreation/hooks/useCaseCreationWorkflowDefinition';
import { useCaseCreationContext } from '@/pages/Entities/components/CaseCreation/context/case-creation-context/hooks/useCaseCreationContext';

export const useCaseCreationLogic = () => {
  const { data: customer } = useCustomerQuery();
  const { isOpen, setIsOpen: setOpen } = useCaseCreationContext();
  const { workflowDefinition, isLoading, error } = useCaseCreationWorkflowDefinition();

  return {
    error,
    isOpen,
    setOpen,
    isLoading,
    workflowDefinition,
    isDemoAccount: customer?.config?.isDemoAccount,
    workflowDefinitionName:
      workflowDefinition?.displayName || titleCase(workflowDefinition?.name ?? ''),
  };
};
