import { AdsProviders } from '@/domains/business-reports/constants';
import { TAdsProvider } from '@/domains/business-reports/types';
import { adsProviderAdapter } from '@/domains/business-reports/adapters/ads-provider-adapter/ads-provider-adapter';

const getLabel = ({ label, provider }: { label: string; provider: string }) => {
  if (label === 'page') {
    return `${provider} Page`;
  }

  return label;
};

export const reportAdapter = {
  DEFAULT: (data: Record<string, any>) => {
    return {
      websitesCompanyAnalysis:
        data?.report?.data?.summary?.riskIndicatorsByDomain?.companyNameViolations?.map(
          ({ name, riskLevel }) => ({
            label: name,
            severity: riskLevel,
          }),
        ),
      adsAndSocialMediaAnalysis:
        data?.report?.data?.summary?.riskIndicatorsByDomain?.adsAndSocialViolations?.map(
          ({ name, riskLevel }) => ({
            label: name,
            severity: riskLevel,
          }),
        ),
      adsAndSocialMediaPresence: Object.entries(data?.report?.data?.socialMedia?.ads ?? {})
        .map(([provider, data]) => {
          if (!AdsProviders.includes(provider.toUpperCase() as TAdsProvider)) {
            return;
          }

          const adapter = adsProviderAdapter[provider as keyof typeof adsProviderAdapter];

          const adaptedData = adapter(data);

          return {
            label: provider,
            items: Object.entries(adaptedData).map(([label, value]) => ({
              label: getLabel({
                label,
                provider,
              }),
              value,
            })),
          };
        })
        ?.filter(Boolean),
      websiteLineOfBusinessAnalysis:
        data?.report?.data?.summary?.riskIndicatorsByDomain?.lineOfBusinessViolations?.map(
          ({ name, riskLevel }) => ({
            label: name,
            severity: riskLevel,
          }),
        ),
      ecosystemAndTransactionsAnalysis:
        data?.report?.data?.summary?.riskIndicatorsByDomain?.ecosystemViolations?.map(
          ({ name, riskLevel }) => ({
            label: name,
            severity: riskLevel,
          }),
        ),
      ecosystemAndTransactionsMatches: data?.report?.data?.ecosystem?.domains?.map(
        ({ domain, relatedNode, relatedNodeType, indicator }) => ({
          matchedName: domain,
          relatedNode,
          relatedNodeType: relatedNodeType,
          indicators: {
            label: indicator?.name,
            severity: indicator?.riskLevel,
          },
        }),
      ),
      websiteCredibilityAnalysis:
        data?.report?.data?.summary?.riskIndicatorsByDomain?.tldViolations?.map(
          ({ name, riskLevel }) => ({
            label: name,
            severity: riskLevel,
          }),
        ),
      adsImages: Object.entries(data?.report?.data?.socialMedia?.ads ?? {} ?? {})
        .map(([provider, data]) => ({
          provider,
          src: data?.imageUrl,
          link: data?.adsInformation?.link,
        }))
        .filter(Boolean),
      relatedAdsImages: Object.values(data?.report?.data?.socialMedia?.ads ?? {}).map(
        data => data?.pickedAd?.link,
      ),
      onlineReputationAnalysis: data?.report?.data?.websiteScamAnalysis?.riskIndicators?.map(
        ({ name }) => name,
      ),
      summary: data?.report?.data?.summary?.summary,
      riskScore: data?.report?.data?.summary?.riskScore,
      riskLevels: data?.report?.data?.summary?.riskLevels,
      recommendations: data?.report?.data?.summary?.recommendations,
      companyReputationAnalysis:
        data?.report?.data?.websiteCompanyAnalysis?.scamOrFraud?.indicators,
      lineOfBusinessDescription: data?.report?.data?.lineOfBusiness?.lobDescription,
      relatedAdsSummary: data?.report?.data?.socialMedia?.relatedAds?.summary,
      pricingAnalysis: data?.report?.data?.pricing?.riskIndicators?.map(({ name }) => name),
      websiteStructureAndContentEvaluation: data?.report?.data?.structure?.riskIndicators?.map(
        ({ name }) => name,
      ),
      trafficAnalysis: [
        {
          label: 'Estimated Monthly Visits',
          items: data?.report?.data?.traffic?.engagementSignals ?? [],
        },
        {
          label: 'Traffic Sources',
          items: data?.report?.data?.traffic?.trafficSizeSignals ?? [],
        },
        {
          label: 'Engagements',
          items: data?.report?.data?.traffic?.trafficSourcesSignals ?? [],
        },
      ] satisfies Array<{
        label: string;
        items: string[];
      }>,
    };
  },
  v1: (data: Record<string, any>) => {
    return {
      websitesCompanyAnalysis:
        data?.report?.data?.summary?.riskIndicatorsByDomain?.companyNameViolations?.map(
          ({ name, riskLevel }) => ({
            label: name,
            severity: riskLevel,
          }),
        ),
      adsAndSocialMediaAnalysis:
        data?.report?.data?.summary?.riskIndicatorsByDomain?.adsAndSocialViolations?.map(
          ({ name, riskLevel }) => ({
            label: name,
            severity: riskLevel,
          }),
        ),
      adsAndSocialMediaPresence: Object.entries(data?.report?.data?.socialMedia?.ads ?? {})
        .map(([provider, data]) => {
          if (!AdsProviders.includes(provider.toUpperCase() as TAdsProvider)) {
            return;
          }

          const adapter = adsProviderAdapter[provider as keyof typeof adsProviderAdapter];

          const adaptedData = adapter(data);

          return {
            label: provider,
            items: Object.entries(adaptedData).map(([label, value]) => ({
              label: getLabel({
                label,
                provider,
              }),
              value,
            })),
          };
        })
        ?.filter(Boolean),
      websiteLineOfBusinessAnalysis:
        data?.report?.data?.summary?.riskIndicatorsByDomain?.lineOfBusinessViolations?.map(
          ({ name, riskLevel }) => ({
            label: name,
            severity: riskLevel,
          }),
        ),
      ecosystemAndTransactionsAnalysis:
        data?.report?.data?.summary?.riskIndicatorsByDomain?.ecosystemViolations?.map(
          ({ name, riskLevel }) => ({
            label: name,
            severity: riskLevel,
          }),
        ),
      ecosystemAndTransactionsMatches: data?.report?.data?.ecosystem?.domains?.map(
        ({ domain, relatedNode, relatedNodeType, indicator }) => ({
          matchedName: domain,
          relatedNode,
          relatedNodeType: relatedNodeType,
          indicators: {
            label: indicator?.name,
            severity: indicator?.riskLevel,
          },
        }),
      ),
      websiteCredibilityAnalysis:
        data?.report?.data?.summary?.riskIndicatorsByDomain?.tldViolations?.map(
          ({ name, riskLevel }) => ({
            label: name,
            severity: riskLevel,
          }),
        ),
      adsImages: Object.entries(data?.report?.data?.socialMedia?.ads ?? {} ?? {})
        .map(([provider, data]) => ({
          provider,
          src: data?.imageUrl,
          link: data?.adsInformation?.link,
        }))
        .filter(Boolean),
      relatedAdsImages: Object.values(data?.report?.data?.socialMedia?.ads ?? {}).map(
        data => data?.pickedAd?.link,
      ),
      onlineReputationAnalysis: data?.report?.data?.websiteScamAnalysis?.riskIndicators?.map(
        ({ name }) => name,
      ),
      summary: data?.report?.data?.summary?.summary,
      riskScore: data?.report?.data?.summary?.riskScore,
      riskLevels: data?.report?.data?.summary?.riskLevels,
      recommendations: data?.report?.data?.summary?.recommendations,
      companyReputationAnalysis:
        data?.report?.data?.websiteCompanyAnalysis?.scamOrFraud?.indicators,
      lineOfBusinessDescription: data?.report?.data?.lineOfBusiness?.lobDescription,
      relatedAdsSummary: data?.report?.data?.socialMedia?.relatedAds?.summary,
      pricingAnalysis: data?.report?.data?.pricing?.riskIndicators?.map(({ name }) => name),
      websiteStructureAndContentEvaluation: data?.report?.data?.structure?.riskIndicators?.map(
        ({ name }) => name,
      ),
      trafficAnalysis: [
        {
          label: 'Estimated Monthly Visits',
          items: data?.report?.data?.traffic?.engagementSignals ?? [],
        },
        {
          label: 'Traffic Sources',
          items: data?.report?.data?.traffic?.trafficSizeSignals ?? [],
        },
        {
          label: 'Engagements',
          items: data?.report?.data?.traffic?.trafficSourcesSignals ?? [],
        },
      ] satisfies Array<{
        label: string;
        items: string[];
      }>,
    };
  },
} as const;
