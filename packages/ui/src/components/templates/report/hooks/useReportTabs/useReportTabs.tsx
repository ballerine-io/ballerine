import { createReportAdapter } from '@/components';
import React, { ComponentProps, ReactNode, useMemo } from 'react';
import { BusinessReportSummary } from '@/components/templates/report/components/BusinessReportSummary';
import { WebsitesCompany } from '@/components/templates/report/components/WebsitesCompany';
import { WebsiteLineOfBusiness } from '@/components/templates/report/components/WebsiteLineOfBusiness';
import { WebsiteCredibility } from '@/components/templates/report/components/WebsiteCredibility';
import { EcosystemAndTransactions } from '@/components/templates/report/components/EcosystemAndTransactions';
import { AdsAndSocialMedia } from '@/components/templates/report/components/AdsAndSocialMedia';
import { Writable } from 'type-fest';

export const useReportTabs = ({
  reportVersion,
  report,
  companyName,
  Link,
}: {
  reportVersion: number;
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
    ecosystemAndTransactionsAnalysis,
    summary,
    riskScore,
    riskLevels,
    companyReputationAnalysis,
    relatedAdsSummary,
    lineOfBusinessDescription,
    onlineReputationAnalysis,
    pricingAnalysis,
    websiteStructureAndContentEvaluation,
    trafficAnalysis,
    ecosystemAndTransactionsMatches,
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
      title: 'Ecosystem and Transactions Analysis',
      search: '?activeTab=ecosystemAndTransactions',
      violations: ecosystemAndTransactionsAnalysis ?? [],
    },
  ] as const satisfies ReadonlyArray<{
    title: string;
    search: string;
    violations: Array<{
      label: string;
      severity: string;
    }>;
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
          label: 'Ecosystem and Transactions',
          value: 'ecosystemAndTransactions',
          content: (
            <EcosystemAndTransactions
              violations={ecosystemAndTransactionsAnalysis ?? []}
              matches={ecosystemAndTransactionsMatches ?? []}
            />
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
      ] as const satisfies ReadonlyArray<{
        label: string;
        value: string;
        content: ReactNode | ReactNode[];
      }>,
    [
      Link,
      adsAndSocialMediaAnalysis,
      adsAndSocialMediaPresence,
      adsImages,
      companyName,
      companyReputationAnalysis,
      ecosystemAndTransactionsAnalysis,
      ecosystemAndTransactionsMatches,
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
