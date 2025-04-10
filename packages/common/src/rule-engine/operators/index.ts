import { OPERATION } from './enums';

export { BaseOperator } from './helpers';

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
  UBO_MISMATCH,
} from './helpers';

export { IDV_CHECK } from './idv-check';
export { COMPANY_SANCTIONS_CATEGORIES } from './company-sanctions-by-category';

export const OPERATORS_WITHOUT_PATH_COMPARISON = [
  OPERATION.AML_CHECK,
  OPERATION.BETWEEN,
  OPERATION.LAST_YEAR,
  OPERATION.IDV_CHECK,
  OPERATION.COMPANY_SANCTIONS_CATEGORIES,
] as const;

export const OPERATORS_WITH_THRESHOLD = [OPERATION.FUZZY_MATCH_SCORE_LT] as const;

export type TUnifiedApiClient = {
  runEntityMatchingV2: (payload: {
    entity1: string;
    entity2: string;
    includeAnalysis: boolean;
  }) => Promise<{ data: { similarityScore: number & Record<string, unknown> } }>;
};
