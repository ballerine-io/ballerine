export const convertFieldIdToObjectPath = (id: string) => {
  return id.replace('root_', '').replaceAll('_', '.');
};
