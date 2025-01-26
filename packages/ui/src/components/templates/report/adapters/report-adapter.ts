import { severityToDisplaySeverity } from '@/components/templates/report/constants';
import { TAdsProvider } from '@/components/templates/report/types';
import { booleanToYesOrNo, SeverityType } from '@ballerine/common';

const getLabel = ({ label, provider }: { label: string; provider: string }) => {
  if (label === 'page') {
    return `${provider} Page`;
  }

  return label;
};

export const toRiskLabels = (riskIndicators: Array<{ name: string; riskLevel: string }>) => {
  if (!Array.isArray(riskIndicators) || !riskIndicators.length) {
    return [];
  }

  return riskIndicators.map(({ name, riskLevel, ...rest }) => ({
    label: name,
    severity:
      severityToDisplaySeverity[riskLevel as keyof typeof severityToDisplaySeverity] ?? riskLevel,
  }));
};

export const toSocialMediaPresence = (data: Record<string, any>) => {
  const { facebookData, instagramData } = data ?? {};

  return {
    facebook: {
      page: facebookData?.pageUrl,
      id: facebookData?.id,
      creationDate: facebookData?.creationDate,
      categories: facebookData?.pageCategories,
      address: facebookData?.address,
      phoneNumber: facebookData?.phoneNumber,
      email: facebookData?.email,
      likes: facebookData?.numberOfLikes,
    },
    instagram: {
      page: instagramData?.pageUrl,
      userName: instagramData?.username,
      categories: instagramData?.pageCategories,
      biography: instagramData?.biography,
      followers: instagramData?.numberOfFollowers,
      isBusinessAccount: booleanToYesOrNo(instagramData?.isBusinessAccount),
      isVerified: booleanToYesOrNo(instagramData?.isVerified),
    },
  } as const satisfies Record<Lowercase<TAdsProvider>, Record<string, unknown>>;
};

export const toAdsImages = (data: Record<string, any>) => {
  const { facebookData, instagramData } = data ?? {};

  return {
    facebook: {
      src: facebookData?.screenshotUrl,
      link: facebookData?.pageUrl,
    },
    instagram: {
      src: instagramData?.screenshotUrl,
      link: instagramData?.pageUrl,
    },
  };
};

const normalizeRiskLevel = (riskTypeLevels: Record<string, SeverityType>) => {
  return Object.entries(riskTypeLevels).reduce((acc, [riskType, riskLevel]) => {
    acc[riskType] =
      severityToDisplaySeverity[riskLevel as keyof typeof severityToDisplaySeverity] ?? riskLevel;

    return acc;
  }, {} as Record<string, SeverityType>);
};

const normalizeHyphenedDataString = (str: string) => {
  const parts = str.split(' - ');

  return {
    label: parts.length > 1 ? parts.slice(0, -1).join(' - ') : parts.at(0),
    value: parts.at(-1),
  };
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
      adsAndSocialMediaPresence: toSocialMediaPresence(report?.socialMedia),
      websiteLineOfBusinessAnalysis:
        report?.summary?.riskIndicatorsByDomain?.lineOfBusinessViolations?.map(
          ({
            name,
            riskLevel,
            sourceUrl,
            screenshot,
            explanation,
          }: {
            name: string;
            riskLevel: string;
            sourceUrl: string;
            screenshot: {
              screenshotUrl: string;
            };
            explanation: string;
          }) => ({
            label: name,
            severity:
              severityToDisplaySeverity[riskLevel as keyof typeof severityToDisplaySeverity] ??
              riskLevel,
            screenshotUrl: screenshot?.screenshotUrl,
            sourceUrl,
            explanation,
          }),
        ),
      ecosystemAnalysis: toRiskLabels(report?.summary?.riskIndicatorsByDomain?.ecosystemViolations),
      ecosystemMatches: report?.ecosystem?.domains?.map(
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
      adsImages: toAdsImages(report?.socialMedia),
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
      ongoingMonitoringSummary: report?.summary?.ongoingMonitoringSummary,
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
      trafficAnalysis: {
        montlyVisitsIndicators: (
          report?.transactionLaundering?.trafficAnalysis?.montlyVisitsIndicators ?? []
        ).map(normalizeHyphenedDataString),
        trafficSources: (report?.transactionLaundering?.trafficAnalysis?.trafficSources ?? []).map(
          normalizeHyphenedDataString,
        ),
        engagements: (report?.transactionLaundering?.trafficAnalysis?.engagements ?? []).map(
          normalizeHyphenedDataString,
        ),
      },
      homepageScreenshotUrl: report?.homepageScreenshot,
      formattedMcc: report?.lineOfBusiness?.formattedMcc,
    };
  },
} as const;
