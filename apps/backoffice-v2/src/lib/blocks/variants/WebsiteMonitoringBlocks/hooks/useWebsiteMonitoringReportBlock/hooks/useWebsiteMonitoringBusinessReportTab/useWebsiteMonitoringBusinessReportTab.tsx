import { TBusinessReport } from '@/domains/business-reports/fetchers';
import { createReportAdapter } from '@/domains/business-reports/create-report-adapter/create-report-adapter';
import React, { ReactNode, useCallback, useMemo } from 'react';
import { WebsitesCompany } from '@/domains/business-reports/components/WebsitesCompany/WebsitesCompany';
import { WebsiteLineOfBusiness } from '@/domains/business-reports/components/WebsiteLineOfBusiness/WebsiteLineOfBusiness';
import { WebsiteCredibility } from '@/domains/business-reports/components/WebsiteCredibility/WebsiteCredibility';
import { Ecosystem } from '@/domains/business-reports/components/Ecosystem/Ecosystem';
import { AdsAndSocialMedia } from '@/domains/business-reports/components/AdsAndSocialMedia/AdsAndSocialMedia';
import { useSearchParamsByEntity } from '@/common/hooks/useSearchParamsByEntity/useSearchParamsByEntity';
import { useLocation } from 'react-router-dom';
import { Transactions } from '@/domains/business-reports/components/Transactions/Transactions';

export const useWebsiteMonitoringBusinessReportTab = ({
  businessReport,
}: {
  businessReport: TBusinessReport;
}) => {
  const adapter = createReportAdapter({
    reportVersion: businessReport?.report?.version,
  });
  const {
    websitesCompanyAnalysis,
    websiteCredibilityAnalysis,
    adsAndSocialMediaAnalysis,
    adsAndSocialMediaPresence,
    websiteLineOfBusinessAnalysis,
    ecosystemAnalysis,
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
    ecosystemMatches,
    adsImages,
    relatedAdsImages,
    homepageScreenshotUrl,
  } = adapter(businessReport ?? {});
  const tabs = useMemo(
    () =>
      [
        {
          label: "Website's Company",
          value: 'websitesCompany',
          content: (
            <WebsitesCompany
              companyName={businessReport?.business?.companyName ?? ''}
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
          label: <>Transaction Analysis</>,
          value: 'transactionAnalysis',
          content: <Transactions />,
        },
      ] as const satisfies ReadonlyArray<{
        value: string;
        label: ReactNode | ReactNode[];
        content: ReactNode | ReactNode[];
      }>,
    [
      adsAndSocialMediaAnalysis,
      adsAndSocialMediaPresence,
      adsImages,
      companyReputationAnalysis,
      ecosystemAnalysis,
      ecosystemMatches,
      lineOfBusinessDescription,
      onlineReputationAnalysis,
      pricingAnalysis,
      relatedAdsImages,
      relatedAdsSummary,
      trafficAnalysis,
      websiteCredibilityAnalysis,
      websiteLineOfBusinessAnalysis,
      websiteStructureAndContentEvaluation,
      websitesCompanyAnalysis,
      businessReport?.business?.companyName,
    ],
  );
  const [{ activeMonitoringTab }] = useSearchParamsByEntity();
  const { search } = useLocation();
  const getUpdatedSearchParamsWithActiveMonitoringTab = useCallback(
    ({ tab, search }: { tab: string; search: string }) => {
      const searchParams = new URLSearchParams(search);

      searchParams.set('activeMonitoringTab', tab);

      return searchParams.toString();
    },
    [],
  );
  const riskIndicators = [
    {
      title: "Website's Company Analysis",
      search: getUpdatedSearchParamsWithActiveMonitoringTab({ tab: 'websitesCompany', search }),
      violations: websitesCompanyAnalysis ?? [],
    },
    {
      title: 'Website Credibility Analysis',
      search: getUpdatedSearchParamsWithActiveMonitoringTab({ tab: 'websiteCredibility', search }),
      violations: websiteCredibilityAnalysis,
    },
    {
      title: 'Ads and Social Media Analysis',
      search: getUpdatedSearchParamsWithActiveMonitoringTab({ tab: 'adsAndSocialMedia', search }),
      violations: adsAndSocialMediaAnalysis ?? [],
    },
    {
      title: 'Website Line of Business Analysis',
      search: getUpdatedSearchParamsWithActiveMonitoringTab({
        tab: 'websiteLineOfBusiness',
        search,
      }),
      violations: websiteLineOfBusinessAnalysis ?? [],
    },
    {
      title: 'Ecosystem Analysis',
      search: getUpdatedSearchParamsWithActiveMonitoringTab({
        tab: 'ecosystem',
        search,
      }),
      violations: ecosystemAnalysis ?? [],
    },
  ] as const satisfies ReadonlyArray<{
    title: string;
    search: string;
    violations: Array<{
      label: string;
      severity: string;
    }>;
  }>;

  return {
    activeMonitoringTab,
    riskIndicators,
    riskLevels,
    riskScore,
    tabs,
    summary,
    getUpdatedSearchParamsWithActiveMonitoringTab,
    search,
    homepageScreenshotUrl,
  };
};
