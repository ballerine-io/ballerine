export const aliasIndividualAsEndUser = (entityType: 'individual' | 'business' | (string & {})) => {
  if (entityType === 'individual') {
    return 'endUser';
  }

  return entityType;
};
