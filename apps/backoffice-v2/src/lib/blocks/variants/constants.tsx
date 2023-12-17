import { KybManualReviewLegacyBlocks } from '@/lib/blocks/variants/KybManualReviewLegacyBlocks/KybManualReviewLegacyBlocks';
import { KybDemoBlocks } from '@/lib/blocks/variants/KybDemoBlocks/KybDemoBlocks';

export const UiSchemaVariant = {
  KYB_MANUAL_REVIEW_LEGACY: 'KYB_MANUAL_REVIEW_LEGACY',
  KYB_DEMO: 'KYB_DEMO',
} as const;

export const uiSchemaVariantToBlocksMap = {
  [UiSchemaVariant.KYB_MANUAL_REVIEW_LEGACY]: KybManualReviewLegacyBlocks,
  [UiSchemaVariant.KYB_DEMO]: KybDemoBlocks,
} as const;
