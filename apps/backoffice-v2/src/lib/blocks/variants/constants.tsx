import { KybManualReviewLegacyBlocks } from '@/pages/lib/blocks/variants/KybManualReviewLegacyBlocks/KybManualReviewLegacyBlocks';

export const UiSchemaVariant = {
  KYB_MANUAL_REVIEW_LEGACY: 'KYB_MANUAL_REVIEW_LEGACY',
} as const;

export const uiSchemaVariantToBlocksMap = {
  [UiSchemaVariant.KYB_MANUAL_REVIEW_LEGACY]: KybManualReviewLegacyBlocks,
} as const;
