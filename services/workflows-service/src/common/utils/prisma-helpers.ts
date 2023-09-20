export const isUpdateOrCreateByAssociation = (data: unknown): boolean => {
  const associationInputKeys = [
    'connect',
    'create',
    'connectOrCreate',
    'disconnect',
    'set',
    'update',
    'delete',
    'deleteMany',
    'updateMany',
    'upsert',
  ];

  if (Array.isArray(data)) {
    return data.some(isUpdateOrCreateByAssociation.bind(this));
  }

  if (typeof data !== 'object' || data === null) {
    return false;
  }

  return Object.entries(data).some(([key, value]) => {
    if (associationInputKeys.includes(key)) {
      return true;
    }

    return isUpdateOrCreateByAssociation(value);
  });
};
