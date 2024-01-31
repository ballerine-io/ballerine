export interface SocialMediaReportData {
  riskRank: number;
  riskIndicators: string[];
  summary: string;
  ads: {
    facebook: {
      pageInformation: Record<string, unknown>;
      imageUrl: string;
      link: string;
      pickedAd: {
        imageUrl: string;
        link: string;
      };
    };
    instagram: {
      pageInformation: Record<string, unknown>;
      imageUrl: string;
      link: string;
      pickedAd: {
        imageUrl: string;
        link: string;
      };
    };
  };
  website: {
    url: string;
  };
}
