import { OPERATION } from './enums';

// Export base operators class
export { BaseOperator } from './helpers';

// Export all standard operators from helpers.ts
export {
  EQUALS,
  NOT_EQUALS,
  IN,
  IN_CASE_INSENSITIVE,
  NOT_IN,
  GT,
  LT,
  GTE,
  LTE,
  BETWEEN,
  LAST_YEAR,
  EXISTS,
  AML_CHECK,
  FUZZY_MATCH_SCORE_LT,
} from './helpers';

// Export specialized operators
export { IDV_CHECK } from './idv-check';
export { COMPANY_SANCTIONS_ADVERSE_MEDIA } from './company-sanctions-adverse-media';

// Export constants directly as they're not dependent on the operators
export const OPERATORS_WITHOUT_PATH_COMPARISON = [
  OPERATION.AML_CHECK,
  OPERATION.BETWEEN,
  OPERATION.LAST_YEAR,
  OPERATION.IDV_CHECK,
  OPERATION.COMPANY_SANCTIONS_ADVERSE_MEDIA,
] as const;

export const OPERATORS_WITH_THRESHOLD = [OPERATION.FUZZY_MATCH_SCORE_LT] as const;

// Export unified API client type
export type TUnifiedApiClient = {
  runEntityMatchingV2: (payload: {
    entity1: string;
    entity2: string;
    includeAnalysis: boolean;
  }) => Promise<{ data: { similarityScore: number & Record<string, unknown> } }>;
};
