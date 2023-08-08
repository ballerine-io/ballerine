export const aliasIndividualAsEndUser = (entityType: 'individual' | 'business') => {
  if (entityType === 'individual') {
    return 'endUser';
  }

  return entityType;
};
