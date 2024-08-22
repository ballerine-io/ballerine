import { MatchResponseCode } from '@/domains/merchant-screening/constants';

export interface IMerchantScreening {
  name: string;
  terminationReasonCode: string;
  dateAdded: string;

  matches: Record<string, (typeof MatchResponseCode)[keyof typeof MatchResponseCode]>;
  data: Record<string, unknown>;

  exactMatchesAmount: number;
  partialMatchesAmount: number;

  exactMatches: Record<string, unknown>;
  partialMatches: Record<string, unknown>;

  principals: Array<{
    exactMatches: Record<string, unknown>;
    partialMatches: Record<string, unknown>;
  }>;
  urls: Array<{
    exactMatches: Record<string, unknown>;
    partialMatches: Record<string, unknown>;
  }>;
}
