import { AdsProviders } from '@/domains/business-reports/constants';
import { TAdsProvider } from '@/domains/business-reports/types';
import { adsProviderAdapter } from '@/domains/business-reports/adapters/ads-provider-adapter/ads-provider-adapter';
import { severityToDisplaySeverity } from '@/domains/business-reports/fetchers';
import { TSeverity } from '@/common/types';

const getLabel = ({ label, provider }: { label: string; provider: string }) => {
  if (label === 'page') {
    return `${provider} Page`;
  }

  return label;
};

export const toRiskLabels = (
  riskIndicators: Array<{ name: string; riskLevel: string; [key: string]: unknown }>,
) => {
  if (!Array.isArray(riskIndicators) || !riskIndicators.length) {
    return [];
  }

  return riskIndicators.map(({ name, riskLevel, ...rest }) => ({
    label: name,
    severity:
      severityToDisplaySeverity[riskLevel as keyof typeof severityToDisplaySeverity] ?? riskLevel,
    ...rest,
  }));
};

const normalizeRiskLevel = (riskTypeLevels: Record<string, TSeverity>) => {
  return Object.entries(riskTypeLevels).reduce((acc, [riskType, riskLevel]) => {
    acc[riskType] =
      severityToDisplaySeverity[riskLevel as keyof typeof severityToDisplaySeverity] ?? riskLevel;

    return acc;
  }, {} as Record<string, TSeverity>);
};

export const reportAdapter = {
  DEFAULT: (data: Record<string, any>) => {
    return {
      websitesCompanyAnalysis: toRiskLabels(
        data?.report?.data?.summary?.riskIndicatorsByDomain?.companyNameViolations,
      ),
      adsAndSocialMediaAnalysis: toRiskLabels(
        data?.report?.data?.summary?.riskIndicatorsByDomain?.adsAndSocialViolations,
      ),
      adsAndSocialMediaPresence: [
        ...Object.entries({ facebook: data?.report?.data?.socialMedia?.facebookData ?? {} }),
        ...Object.entries({ instagram: data?.report?.data?.socialMedia?.instagramData ?? {} }),
      ]
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
      websiteLineOfBusinessAnalysis: toRiskLabels(
        data?.report?.data?.summary?.riskIndicatorsByDomain?.lineOfBusinessViolations,
      ),
      ecosystemAndTransactionsAnalysis: toRiskLabels(
        data?.report?.data?.summary?.riskIndicatorsByDomain?.ecosystemViolations,
      ),
      ecosystemAndTransactionsMatches: data?.report?.data?.ecosystem?.domains?.map(
        ({ domain, relatedNode, relatedNodeType, indicator }) => ({
          matchedName: domain,
          relatedNode,
          relatedNodeType: relatedNodeType,
          indicators: {
            label: indicator?.name,
            severity:
              severityToDisplaySeverity[
                indicator?.riskLevel as keyof typeof severityToDisplaySeverity
              ] ?? indicator?.riskLevel,
          },
        }),
      ),
      websiteCredibilityAnalysis: toRiskLabels(
        data?.report?.data?.summary?.riskIndicatorsByDomain?.tldViolations,
      ),
      adsImages: [
        ...Object.entries({ facebook: data?.report?.data?.socialMedia?.facebookData ?? {} }),
        ...Object.entries({ instagram: data?.report?.data?.socialMedia?.instagramData ?? {} }),
      ]
        .map(([provider, data]) => ({
          provider,
          src: data?.screenshotUrl,
          link: data?.pageUrl,
        }))
        .filter(({ src }) => !!src),
      relatedAdsImages: data?.report?.data?.socialMedia?.pickedAds
        ?.map(data => ({
          src: data?.screenshotUrl,
          link: data?.link,
        }))
        .filter(({ src }) => !!src),
      onlineReputationAnalysis: data?.report?.data?.transactionLaundering?.scamOrFraud?.indicators
        ?.filter(({ violation }) => !!violation)
        ?.map(({ violation, sourceUrl }) => ({ label: violation, url: sourceUrl })),
      summary: data?.report?.data?.summary?.summary,
      riskScore: data?.report?.data?.summary?.riskScore,
      riskLevels: normalizeRiskLevel(data?.report?.data?.summary?.riskLevels ?? {}),
      companyReputationAnalysis: data?.report?.data?.websiteCompanyAnalysis?.scamOrFraud?.indicators
        ?.filter(({ violation }) => !!violation)
        ?.map(({ violation, sourceUrl }) => ({ label: violation, url: sourceUrl })),
      lineOfBusinessDescription: data?.report?.data?.lineOfBusiness?.lobDescription,
      relatedAdsSummary: data?.report?.data?.socialMedia?.relatedAds?.summary,
      pricingAnalysis: data?.report?.data?.transactionLaundering?.pricingAnalysis?.indicators,
      formattedMcc: data?.report?.data?.lineOfBusiness?.formattedMcc,
      websiteStructureAndContentEvaluation:
        data?.report?.data?.transactionLaundering?.websiteStructureEvaluation?.indicators,
      trafficAnalysis: [
        {
          label: 'Estimated Monthly Visits',
          items:
            data?.report?.data?.transactionLaundering?.trafficAnalysis?.montlyVisitsIndicators ??
            [],
        },
        {
          label: 'Traffic Sources',
          items: data?.report?.data?.transactionLaundering?.trafficAnalysis?.trafficSources ?? [],
        },
        {
          label: 'Engagements',
          items: data?.report?.data?.transactionLaundering?.trafficAnalysis?.engagements ?? [],
        },
      ] satisfies Array<{
        label: string;
        items: string[];
      }>,
      homepageScreenshotUrl: data?.report?.data?.homepageScreenshot,
    };
  },
  v1: (data: Record<string, any>) => {
    return {
      websitesCompanyAnalysis: toRiskLabels(
        data?.report?.data?.summary?.riskIndicatorsByDomain?.companyNameViolations,
      ),
      adsAndSocialMediaAnalysis: toRiskLabels(
        data?.report?.data?.summary?.riskIndicatorsByDomain?.adsAndSocialViolations,
      ),
      adsAndSocialMediaPresence: [
        ...Object.entries({ facebook: data?.report?.data?.socialMedia?.facebookData ?? {} }),
        ...Object.entries({ instagram: data?.report?.data?.socialMedia?.instagramData ?? {} }),
      ]
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
      websiteLineOfBusinessAnalysis: toRiskLabels(
        data?.report?.data?.summary?.riskIndicatorsByDomain?.lineOfBusinessViolations,
      ),
      ecosystemAndTransactionsAnalysis: toRiskLabels(
        data?.report?.data?.summary?.riskIndicatorsByDomain?.ecosystemViolations,
      ),
      ecosystemAndTransactionsMatches: data?.report?.data?.ecosystem?.domains?.map(
        ({ domain, relatedNode, relatedNodeType, indicator }) => ({
          matchedName: domain,
          relatedNode,
          relatedNodeType: relatedNodeType,
          indicators: {
            label: indicator?.name,
            severity:
              severityToDisplaySeverity[
                indicator?.riskLevel as keyof typeof severityToDisplaySeverity
              ] ?? indicator?.riskLevel,
          },
        }),
      ),
      websiteCredibilityAnalysis: toRiskLabels(
        data?.report?.data?.summary?.riskIndicatorsByDomain?.tldViolations,
      ),
      adsImages: [
        ...Object.entries({ facebook: data?.report?.data?.socialMedia?.facebookData ?? {} }),
        ...Object.entries({ instagram: data?.report?.data?.socialMedia?.instagramData ?? {} }),
      ]
        .map(([provider, data]) => ({
          provider,
          src: data?.screenshotUrl,
          link: data?.pageUrl,
        }))
        .filter(({ src }) => !!src),
      relatedAdsImages: data?.report?.data?.socialMedia?.pickedAds
        ?.map(data => ({
          src: data?.screenshotUrl,
          link: data?.link,
        }))
        .filter(({ src }) => !!src),
      onlineReputationAnalysis: data?.report?.data?.transactionLaundering?.scamOrFraud?.indicators
        ?.filter(({ violation }) => !!violation)
        ?.map(({ violation, sourceUrl }) => ({ label: violation, url: sourceUrl })),
      summary: data?.report?.data?.summary?.summary,
      riskScore: data?.report?.data?.summary?.riskScore,
      riskLevels: normalizeRiskLevel(data?.report?.data?.summary?.riskLevels ?? {}),
      companyReputationAnalysis: data?.report?.data?.websiteCompanyAnalysis?.scamOrFraud?.indicators
        ?.filter(({ violation }) => !!violation)
        ?.map(({ violation, sourceUrl }) => ({ label: violation, url: sourceUrl })),
      lineOfBusinessDescription: data?.report?.data?.lineOfBusiness?.lobDescription,
      formattedMcc: data?.report?.data?.lineOfBusiness?.formattedMcc,
      relatedAdsSummary: data?.report?.data?.socialMedia?.relatedAds?.summary,
      pricingAnalysis: data?.report?.data?.transactionLaundering?.pricingAnalysis?.indicators,
      websiteStructureAndContentEvaluation:
        data?.report?.data?.transactionLaundering?.websiteStructureEvaluation?.indicators,
      trafficAnalysis: [
        {
          label: 'Estimated Monthly Visits',
          items:
            data?.report?.data?.transactionLaundering?.trafficAnalysis?.montlyVisitsIndicators ??
            [],
        },
        {
          label: 'Traffic Sources',
          items: data?.report?.data?.transactionLaundering?.trafficAnalysis?.trafficSources ?? [],
        },
        {
          label: 'Engagements',
          items: data?.report?.data?.transactionLaundering?.trafficAnalysis?.engagements ?? [],
        },
      ] satisfies Array<{
        label: string;
        items: string[];
      }>,
      homepageScreenshotUrl: null,
    };
  },
} as const;
