import { IUIDefinition } from '@/domains/ui-definitions/ui-definitions.types';
import { request } from '@/lib/request';

export const fetchUIDefinitions = async () => {
  const result = await request.get<IUIDefinition[]>('/external/ui-definition');

  return result.data;
};
