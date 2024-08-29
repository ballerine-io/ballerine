export interface IMerchantScreening {
  name: string;
  terminationReasonCode: string;
  dateAdded: string;

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

  raw: Record<string, unknown>;
}
