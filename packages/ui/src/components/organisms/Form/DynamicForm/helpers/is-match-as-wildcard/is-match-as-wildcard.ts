import { formatWildcardId } from '@/components/organisms/Form/DynamicForm/helpers/format-wildcard-id/format-wildcard-id';

export const isMatchAsWildcard = (id: string, priorityFieldId: string) => {
  const wildcardElementId = formatWildcardId(id);

  return priorityFieldId === wildcardElementId;
};
