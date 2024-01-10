import { generateEntityId } from '@/pages/Entities/components/CaseGeneration/components/CaseGenerationForm/hooks/useCaseGenerationForm/utils/generate-entity-id';
import { AnyObject } from '@ballerine/ui';

export const prepareContext = (formData: AnyObject): AnyObject => {
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
