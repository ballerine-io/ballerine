export const createInitials = (str: string) =>
  str
    ?.split(' ')
    ?.map(word => word?.[0]?.toUpperCase())
    ?.join('')
    .substring(0, 2);
