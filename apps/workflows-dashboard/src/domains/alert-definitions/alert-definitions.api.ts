import { IAlertDefinition } from '@/domains/alert-definitions/alert-definitions.types';
import { request } from '@/lib/request';

export const fetchAlertDefinitionsList = async () => {
  const result = await request.get<IAlertDefinition[]>('/external/alert-definition');

  return result.data;
};
