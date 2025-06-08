export const formatDocumentId = ({
  type,
  category,
  entityType,
  entityId,
}: {
  type: string;
  category: string;
  entityType: string;
  entityId: string;
}) => `${type}-${category}-${entityType}-${entityId}`;
