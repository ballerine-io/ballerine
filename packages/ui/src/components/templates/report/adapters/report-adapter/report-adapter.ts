import { AdsProviders, severityToDisplaySeverity } from '@/components/templates/report/constants';
import { adsProviderAdapter } from '@/components';
import { TAdsProvider } from '@/components/templates/report/types';
import { SeverityType } from '@ballerine/common';

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

const normalizeRiskLevel = (riskTypeLevels: Record<string, SeverityType>) => {
  return Object.entries(riskTypeLevels).reduce((acc, [riskType, riskLevel]) => {
    acc[riskType] =
      severityToDisplaySeverity[riskLevel as keyof typeof severityToDisplaySeverity] ?? riskLevel;

    return acc;
  }, {} as Record<string, SeverityType>);
};

export const reportAdapter = {
  DEFAULT: (report: Record<string, any>) => {
    return {
      websitesCompanyAnalysis: toRiskLabels(
        report?.summary?.riskIndicatorsByDomain?.companyNameViolations,
      ),
      adsAndSocialMediaAnalysis: toRiskLabels(
        report?.summary?.riskIndicatorsByDomain?.adsAndSocialViolations,
      ),
      adsAndSocialMediaPresence: [
        ...Object.entries({ facebook: report?.socialMedia?.facebookData ?? {} }),
        ...Object.entries({ instagram: report?.socialMedia?.instagramData ?? {} }),
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
        ?.filter((value): value is NonNullable<typeof value> => Boolean(value)),
      websiteLineOfBusinessAnalysis: toRiskLabels(
        report?.summary?.riskIndicatorsByDomain?.lineOfBusinessViolations,
      ),
      ecosystemAndTransactionsAnalysis: toRiskLabels(
        report?.summary?.riskIndicatorsByDomain?.ecosystemViolations,
      ),
      ecosystemAndTransactionsMatches: report?.ecosystem?.domains?.map(
        ({
          domain,
          relatedNode,
          relatedNodeType,
          indicator,
        }: {
          domain: string;
          relatedNode: string;
          relatedNodeType: string;
          indicator: Record<
            string,
            {
              name: string;
              riskLevel: string;
            }
          >;
        }) => ({
          matchedName: domain,
          relatedNode,
          relatedNodeType: relatedNodeType,
          indicators: {
            label: indicator?.name,
            severity:
              severityToDisplaySeverity[
                indicator?.riskLevel as unknown as keyof typeof severityToDisplaySeverity
              ] ?? indicator?.riskLevel,
          },
        }),
      ),
      websiteCredibilityAnalysis: toRiskLabels(
        report?.summary?.riskIndicatorsByDomain?.tldViolations,
      ),
      adsImages: [
        ...Object.entries({ facebook: report?.socialMedia?.facebookData ?? {} }),
        ...Object.entries({ instagram: report?.socialMedia?.instagramData ?? {} }),
      ]
        .map(([provider, data]) => ({
          provider,
          src: data?.screenshotUrl,
          link: data?.pageUrl,
        }))
        .filter(({ src }: { src: string }) => !!src),
      relatedAdsImages: report?.socialMedia?.pickedAds
        ?.map((data: { screenshotUrl: string; link: string }) => ({
          src: data?.screenshotUrl,
          link: data?.link,
        }))
        .filter(({ src }: { src: string }) => !!src),
      onlineReputationAnalysis: report?.transactionLaundering?.scamOrFraud?.indicators
        ?.filter(({ violation }: { violation: string }) => !!violation)
        ?.map(({ violation, sourceUrl }: { violation: string; sourceUrl: string }) => ({
          label: violation,
          url: sourceUrl,
        })),
      summary: report?.summary?.summary,
      riskScore: report?.summary?.riskScore,
      riskLevels: normalizeRiskLevel(report?.summary?.riskLevels ?? {}),
      companyReputationAnalysis: report?.websiteCompanyAnalysis?.scamOrFraud?.indicators
        ?.filter(({ violation }: { violation: string }) => !!violation)
        ?.map(({ violation, sourceUrl }: { violation: string; sourceUrl: string }) => ({
          label: violation,
          url: sourceUrl,
        })),
      lineOfBusinessDescription: report?.lineOfBusiness?.lobDescription,
      relatedAdsSummary: report?.socialMedia?.relatedAds?.summary,
      pricingAnalysis: report?.transactionLaundering?.pricingAnalysis?.indicators,
      websiteStructureAndContentEvaluation:
        report?.transactionLaundering?.websiteStructureEvaluation?.indicators,
      trafficAnalysis: [
        {
          label: 'Estimated Monthly Visits',
          items: report?.transactionLaundering?.trafficAnalysis?.montlyVisitsIndicators ?? [],
        },
        {
          label: 'Traffic Sources',
          items: report?.transactionLaundering?.trafficAnalysis?.trafficSources ?? [],
        },
        {
          label: 'Engagements',
          items: report?.transactionLaundering?.trafficAnalysis?.engagements ?? [],
        },
      ] satisfies Array<{
        label: string;
        items: string[];
      }>,
      homepageScreenshotUrl: report?.homepageScreenshot,
      formattedMcc: report?.lineOfBusiness?.formattedMcc,
    };
  },
  v1: (report: Record<string, any>) => {
    return {
      websitesCompanyAnalysis: toRiskLabels(
        report?.summary?.riskIndicatorsByDomain?.companyNameViolations,
      ),
      adsAndSocialMediaAnalysis: toRiskLabels(
        report?.summary?.riskIndicatorsByDomain?.adsAndSocialViolations,
      ),
      adsAndSocialMediaPresence: [
        ...Object.entries({ facebook: report?.socialMedia?.facebookData ?? {} }),
        ...Object.entries({ instagram: report?.socialMedia?.instagramData ?? {} }),
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
        ?.filter((value): value is NonNullable<typeof value> => Boolean(value)),
      websiteLineOfBusinessAnalysis: toRiskLabels(
        report?.summary?.riskIndicatorsByDomain?.lineOfBusinessViolations,
      ),
      ecosystemAndTransactionsAnalysis: toRiskLabels(
        report?.summary?.riskIndicatorsByDomain?.ecosystemViolations,
      ),
      ecosystemAndTransactionsMatches: report?.ecosystem?.domains?.map(
        ({
          domain,
          relatedNode,
          relatedNodeType,
          indicator,
        }: {
          domain: string;
          relatedNode: string;
          relatedNodeType: string;
          indicator: Record<
            string,
            {
              name: string;
              riskLevel: string;
            }
          >;
        }) => ({
          matchedName: domain,
          relatedNode,
          relatedNodeType: relatedNodeType,
          indicators: {
            label: indicator?.name,
            severity:
              severityToDisplaySeverity[
                indicator?.riskLevel as unknown as keyof typeof severityToDisplaySeverity
              ] ?? indicator?.riskLevel,
          },
        }),
      ),
      websiteCredibilityAnalysis: toRiskLabels(
        report?.summary?.riskIndicatorsByDomain?.tldViolations,
      ),
      adsImages: [
        ...Object.entries({ facebook: report?.socialMedia?.facebookData ?? {} }),
        ...Object.entries({ instagram: report?.socialMedia?.instagramData ?? {} }),
      ]
        .map(([provider, data]) => ({
          provider,
          src: data?.screenshotUrl,
          link: data?.pageUrl,
        }))
        .filter(({ src }) => !!src),
      relatedAdsImages: report?.socialMedia?.pickedAds
        ?.map((data: { screenshotUrl: string; link: string }) => ({
          src: data?.screenshotUrl,
          link: data?.link,
        }))
        .filter(({ src }: { src: string }) => !!src),
      onlineReputationAnalysis: report?.transactionLaundering?.scamOrFraud?.indicators
        ?.filter(({ violation }: { violation: string }) => !!violation)
        ?.map(({ violation, sourceUrl }: { violation: string; sourceUrl: string }) => ({
          label: violation,
          url: sourceUrl,
        })),
      summary: report?.summary?.summary,
      riskScore: report?.summary?.riskScore,
      riskLevels: normalizeRiskLevel(report?.summary?.riskLevels ?? {}),
      companyReputationAnalysis: report?.websiteCompanyAnalysis?.scamOrFraud?.indicators
        ?.filter(({ violation }: { violation: string }) => !!violation)
        ?.map(({ violation, sourceUrl }: { violation: string; sourceUrl: string }) => ({
          label: violation,
          url: sourceUrl,
        })),
      lineOfBusinessDescription: report?.lineOfBusiness?.lobDescription,
      relatedAdsSummary: report?.socialMedia?.relatedAds?.summary,
      pricingAnalysis: report?.transactionLaundering?.pricingAnalysis?.indicators,
      websiteStructureAndContentEvaluation:
        report?.transactionLaundering?.websiteStructureEvaluation?.indicators,
      trafficAnalysis: [
        {
          label: 'Estimated Monthly Visits',
          items: report?.transactionLaundering?.trafficAnalysis?.montlyVisitsIndicators ?? [],
        },
        {
          label: 'Traffic Sources',
          items: report?.transactionLaundering?.trafficAnalysis?.trafficSources ?? [],
        },
        {
          label: 'Engagements',
          items: report?.transactionLaundering?.trafficAnalysis?.engagements ?? [],
        },
      ] satisfies Array<{
        label: string;
        items: string[];
      }>,
      homepageScreenshotUrl: null,
      formattedMcc: report?.lineOfBusiness?.formattedMcc,
    };
  },
} as const;
