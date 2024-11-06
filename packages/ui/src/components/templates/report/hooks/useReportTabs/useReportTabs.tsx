import React, { ComponentProps, ReactNode, useMemo } from 'react';
import { Writable } from 'type-fest';
import { Crown } from 'lucide-react';
import {
  BusinessReportSummary,
  WebsitesCompany,
  WebsiteLineOfBusiness,
  WebsiteCredibility,
  Ecosystem,
  AdsAndSocialMedia,
  Transactions,
  createReportAdapter,
} from '@/components';

export const useReportTabs = ({
  reportVersion,
  report,
  companyName,
  Link,
}: {
  reportVersion: string;
  report: Record<PropertyKey, any>;
  companyName: string;
  Link: ComponentProps<typeof BusinessReportSummary>['Link'];
}) => {
  const adapter = createReportAdapter({
    reportVersion,
  });

  const {
    websitesCompanyAnalysis,
    websiteCredibilityAnalysis,
    adsAndSocialMediaAnalysis,
    adsAndSocialMediaPresence,
    websiteLineOfBusinessAnalysis,
    ecosystemAnalysis,
    summary,
    ongoingMonitoringSummary,
    riskScore,
    riskLevels,
    companyReputationAnalysis,
    relatedAdsSummary,
    lineOfBusinessDescription,
    onlineReputationAnalysis,
    pricingAnalysis,
    websiteStructureAndContentEvaluation,
    trafficAnalysis,
    ecosystemMatches,
    adsImages,
    relatedAdsImages,
    homepageScreenshotUrl,
    formattedMcc,
  } = adapter(report ?? {});
  const riskIndicators = [
    {
      title: "Website's Company Analysis",
      search: '?activeTab=websitesCompany',
      violations: websitesCompanyAnalysis ?? [],
    },
    {
      title: 'Website Credibility Analysis',
      search: '?activeTab=websiteCredibility',
      violations: websiteCredibilityAnalysis,
    },
    {
      title: 'Ads and Social Media Analysis',
      search: '?activeTab=adsAndSocialMedia',
      violations: adsAndSocialMediaAnalysis ?? [],
    },
    {
      title: 'Website Line of Business Analysis',
      search: '?activeTab=websiteLineOfBusiness',
      violations: websiteLineOfBusinessAnalysis ?? [],
    },
    {
      title: 'Ecosystem Analysis',
      search: '?activeTab=ecosystem',
      violations: null,
    },
    {
      title: 'Transactions Analysis',
      search: '?activeTab=transactions',
      violations: null,
    },
  ] as const satisfies ReadonlyArray<{
    title: string;
    search: string;
    violations: Array<{
      label: string;
      severity: string;
    }> | null;
  }>;

  const tabs = useMemo(
    () =>
      [
        {
          label: 'Summary',
          value: 'summary',
          content: (
            <>
              <h3 className={'mb-8 text-lg font-bold'}>Summary</h3>
              <BusinessReportSummary
                summary={summary}
                ongoingMonitoringSummary={ongoingMonitoringSummary}
                riskScore={riskScore}
                riskIndicators={riskIndicators as Writable<typeof riskIndicators>}
                riskLevels={
                  riskLevels as ComponentProps<typeof BusinessReportSummary>['riskLevels']
                }
                Link={Link}
                homepageScreenshotUrl={homepageScreenshotUrl}
              />
            </>
          ),
        },
        {
          label: "Website's Company",
          value: 'websitesCompany',
          content: (
            <WebsitesCompany
              companyName={companyName ?? ''}
              companyReputationAnalysis={companyReputationAnalysis ?? []}
              violations={websitesCompanyAnalysis ?? []}
            />
          ),
        },
        {
          label: 'Website Line of Business',
          value: 'websiteLineOfBusiness',
          content: (
            <WebsiteLineOfBusiness
              violations={websiteLineOfBusinessAnalysis ?? []}
              description={lineOfBusinessDescription}
              formattedMcc={formattedMcc}
            />
          ),
        },
        {
          label: 'Website Credibility',
          value: 'websiteCredibility',
          content: (
            <WebsiteCredibility
              violations={websiteCredibilityAnalysis ?? []}
              onlineReputationAnalysis={onlineReputationAnalysis ?? []}
              pricingAnalysis={pricingAnalysis}
              websiteStructureAndContentEvaluation={websiteStructureAndContentEvaluation}
              trafficAnalysis={trafficAnalysis}
            />
          ),
        },
        {
          label: 'Ecosystem',
          value: 'ecosystem',
          content: (
            <Ecosystem violations={ecosystemAnalysis ?? []} matches={ecosystemMatches ?? []} />
          ),
        },
        {
          label: 'Ads and Social Media',
          value: 'adsAndSocialMedia',
          content: (
            <AdsAndSocialMedia
              violations={adsAndSocialMediaAnalysis ?? []}
              mediaPresence={adsAndSocialMediaPresence ?? []}
              adsImages={adsImages}
              relatedAdsImages={relatedAdsImages}
              relatedAdsSummary={relatedAdsSummary}
            />
          ),
        },
        {
          label: (
            <div className={`flex items-center space-x-2`}>
              <span>Transaction Analysis</span>
              <Crown className={`d-4 rounded-full`} />
            </div>
          ),
          value: 'transactions',
          content: <Transactions />,
        },
      ] as const satisfies ReadonlyArray<{
        value: string;
        label: ReactNode | ReactNode[];
        content: ReactNode | ReactNode[];
      }>,
    [
      Link,
      adsAndSocialMediaAnalysis,
      adsAndSocialMediaPresence,
      adsImages,
      companyName,
      companyReputationAnalysis,
      ecosystemAnalysis,
      ecosystemMatches,
      formattedMcc,
      homepageScreenshotUrl,
      lineOfBusinessDescription,
      onlineReputationAnalysis,
      pricingAnalysis,
      relatedAdsImages,
      relatedAdsSummary,
      riskIndicators,
      riskLevels,
      riskScore,
      summary,
      trafficAnalysis,
      websiteCredibilityAnalysis,
      websiteLineOfBusinessAnalysis,
      websiteStructureAndContentEvaluation,
      websitesCompanyAnalysis,
    ],
  );

  return {
    tabs,
    riskIndicators,
  };
};
