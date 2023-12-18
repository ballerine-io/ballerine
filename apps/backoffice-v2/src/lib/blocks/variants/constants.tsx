import { KybManualReviewLegacyBlocks } from '@/lib/blocks/variants/KybManualReviewLegacyBlocks/KybManualReviewLegacyBlocks';
import { KybDemoBlocks } from '@/lib/blocks/variants/KybDemoBlocks/KybDemoBlocks';
import { DefaultBlocks } from '@/lib/blocks/variants/DefaultBlocks/DefaultBlocks';

export const UiSchemaVariant = {
  KYB_MANUAL_REVIEW_LEGACY: 'KYB_MANUAL_REVIEW_LEGACY',
  KYB_DEMO: 'KYB_DEMO',
  DEFAULT: 'DEFAULT',
} as const;

export const uiSchemaVariantToBlocksMap = {
  [UiSchemaVariant.KYB_MANUAL_REVIEW_LEGACY]: KybManualReviewLegacyBlocks,
  [UiSchemaVariant.KYB_DEMO]: KybDemoBlocks,
  [UiSchemaVariant.DEFAULT]: DefaultBlocks,
} as const;
