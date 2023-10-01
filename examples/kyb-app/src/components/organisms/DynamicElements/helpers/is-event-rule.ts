import { EventRule, Rule } from '@app/domains/collection-flow';

export const isEventRule = (rule: unknown): rule is EventRule => {
  if (typeof rule !== 'object') return false;
  if (typeof (rule as Rule).value !== 'object') return false;

  return true;
};
