export const reportAdapter = {
  DEFAULT: (data: Record<string, any>) => {
    return {
      companyNameViolations:
        data?.report?.data?.summary?.riskIndicatorsByDomain?.companyNameViolations,
      adsAndSocialViolations:
        data?.report?.data?.summary?.riskIndicatorsByDomain?.adsAndSocialViolations,
      ads: data?.report?.data?.socialMedia?.ads,
      lineOfBusinessViolations:
        data?.report?.data?.summary?.riskIndicatorsByDomain?.lineOfBusinessViolations,
      ecosystemViolations: data?.report?.data?.summary?.riskIndicatorsByDomain?.ecosystemViolations,
      ecosystemDomains: data?.report?.data?.ecosystem?.domains,
      tldViolations: data?.report?.data?.summary?.riskIndicatorsByDomain?.tldViolations,
      summary: data?.report?.data?.summary?.summary,
      riskScore: data?.report?.data?.summary?.riskScore,
      riskLevels: data?.report?.data?.summary?.riskLevels,
      recommendations: data?.report?.data?.summary?.recommendations,
      scamOrFraudIndicators: data?.report?.data?.websiteCompanyAnalysis?.scamOrFraud?.indicators,
      lineOfBusinessDescription: data?.report?.data?.lineOfBusiness?.lobDescription,
      relatedAdsSummary: data?.report?.data?.socialMedia?.relatedAds?.summary,
    };
  },
  v1: (data: Record<string, any>) => {
    return {
      companyNameViolations:
        data?.report?.data?.summary?.riskIndicatorsByDomain?.companyNameViolations,
      adsAndSocialViolations:
        data?.report?.data?.summary?.riskIndicatorsByDomain?.adsAndSocialViolations,
      ads: data?.report?.data?.socialMedia?.ads,
      lineOfBusinessViolations:
        data?.report?.data?.summary?.riskIndicatorsByDomain?.lineOfBusinessViolations,
      ecosystemViolations: data?.report?.data?.summary?.riskIndicatorsByDomain?.ecosystemViolations,
      ecosystemDomains: data?.report?.data?.ecosystem?.domains,
      tldViolations: data?.report?.data?.summary?.riskIndicatorsByDomain?.tldViolations,
      summary: data?.report?.data?.summary?.summary,
      riskScore: data?.report?.data?.summary?.riskScore,
      riskLevels: data?.report?.data?.summary?.riskLevels,
      recommendations: data?.report?.data?.summary?.recommendations,
      scamOrFraudIndicators: data?.report?.data?.websiteCompanyAnalysis?.scamOrFraud?.indicators,
      lineOfBusinessDescription: data?.report?.data?.lineOfBusiness?.lobDescription,
      relatedAdsSummary: data?.report?.data?.socialMedia?.relatedAds?.summary,
    };
  },
} as const;
