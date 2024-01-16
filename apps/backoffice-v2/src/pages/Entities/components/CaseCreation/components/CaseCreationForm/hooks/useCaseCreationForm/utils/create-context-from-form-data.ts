import { TWorkflowById } from '@/domains/workflows/fetchers';
import { generateEntityId } from '@/pages/Entities/components/CaseCreation/components/CaseCreationForm/hooks/useCaseCreationForm/utils/generate-entity-id';
import { AnyObject } from '@ballerine/ui';

export const createContextFromFormData = (formData: AnyObject): TWorkflowById['context'] => {
  const context = {
    entity: {
      id: generateEntityId(),
      type: 'business',
      ...formData,
    },
    documents: [],
  };

  return context;
};
