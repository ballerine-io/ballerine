export const isEventRule = (rule: unknown): rule is EventRule => {
  if (typeof rule !== 'object') return false;

  return true;
};
