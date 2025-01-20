import { TWorkflowById } from '@/domains/workflows/fetchers';
import { AnyObject } from '@ballerine/ui';

export const createContextFromFormData = (formData: AnyObject): TWorkflowById['context'] => {
  return {
    entity: {},
    documents: [],
    ...formData,
  };
};
