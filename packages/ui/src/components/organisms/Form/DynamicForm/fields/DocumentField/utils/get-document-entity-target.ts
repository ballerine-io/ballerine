import type { TDocumentEntityType } from '@/components/organisms/Form/DocumentsService/types';

/**
 * Document upload target selection:
 * - KYB: metadata.businessId → entityType=business
 * - KYC: metadata.entityId  → entityType=end_user
 */
export const getDocumentEntityTarget = (
  metadata: unknown,
  caller: 'DocumentField' | 'useDocumentUpload',
): { entityType: TDocumentEntityType; entityId: string } => {
  const m = (metadata ?? {}) as Record<string, unknown>;

  const businessId = typeof m.businessId === 'string' ? m.businessId : undefined;
  const entityId = typeof m.entityId === 'string' ? m.entityId : undefined;

  const entityType: TDocumentEntityType = businessId ? 'business' : 'end_user';
  const resolvedEntityId = businessId ?? entityId;

  if (!resolvedEntityId) {
    throw new Error(
      `${caller} requires \`metadata.businessId\` (KYB) or \`metadata.entityId\` (KYC) to be present.`,
    );
  }

  return { entityType, entityId: resolvedEntityId };
};

