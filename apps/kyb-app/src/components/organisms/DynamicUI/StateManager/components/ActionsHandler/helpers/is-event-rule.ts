import { EventRule, IRule } from '@/domains/collection-flow';

export const isEventRule = (rule: unknown): rule is EventRule => {
  if (typeof rule !== 'object') return false;
  if (typeof (rule as IRule).value !== 'object') return false;

  return true;
};
