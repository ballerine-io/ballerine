export const createInitials = (str: string) =>
  str
    ?.split(' ')
    .map(word => word.toUpperCase()[0])
    .join('');
