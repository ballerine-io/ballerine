import { TWorkflowById } from '@/domains/workflows/fetchers';
import { AnyObject } from '@ballerine/ui';

export const createContextFromFormData = (formData: AnyObject): TWorkflowById['context'] => {
  const context = {
    entity: formData,
    documents: [],
  };

  return context;
};
