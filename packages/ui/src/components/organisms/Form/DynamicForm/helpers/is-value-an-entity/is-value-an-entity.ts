import { IEntity } from '../../fields/EntityFieldGroup/types';

export const isValueAnEntity = (value: unknown): value is IEntity => {
  if (typeof value !== 'object' || value === null) return false;

  return '__id' in value || 'ballerineEntityId' in value;
};
