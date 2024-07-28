import { useNavigate, useParams } from 'react-router-dom';
import { useBusinessReportByIdQuery } from '@/domains/business-reports/hooks/queries/useBusinessReportByIdQuery/useBusinessReportByIdQuery';
import { createReportAdapter } from '@/domains/business-reports/create-report-adapter/create-report-adapter';
import React, { ReactNode, useCallback, useMemo } from 'react';
import { BusinessReportSummary } from '@/common/components/molecules/BusinessReportSummary/BusinessReportSummary';
import { WebsitesCompany } from '@/domains/business-reports/components/WebsitesCompany/WebsitesCompany';
import { WebsiteLineOfBusiness } from '@/domains/business-reports/components/WebsiteLineOfBusiness/WebsiteLineOfBusiness';
import { WebsiteCredibility } from '@/domains/business-reports/components/WebsiteCredibility/WebsiteCredibility';
import { EcosystemAndTransactions } from '@/domains/business-reports/components/EcosystemAndTransactions/EcosystemAndTransactions';
import { AdsAndSocialMedia } from '@/domains/business-reports/components/AdsAndSocialMedia/AdsAndSocialMedia';
import { z } from 'zod';
import { useZodSearchParams } from '@/common/hooks/useZodSearchParams/useZodSearchParams';
import { BusinessReportStatus } from '@/domains/business-reports/fetchers';
import { safeUrl } from '@/common/utils/safe-url/safe-url';

export const useMerchantMonitoringBusinessReportLogic = () => {
  const { businessReportId } = useParams();
  const { data: businessReport } = useBusinessReportByIdQuery({
    id: businessReportId ?? '',
  });
  const adapter = createReportAdapter({
    reportVersion: businessReport?.report?.version,
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
    detectedMcc,
    onlineReputationAnalysis,
    pricingAnalysis,
    websiteStructureAndContentEvaluation,
    trafficAnalysis,
    ecosystemAndTransactionsMatches,
    adsImages,
    relatedAdsImages,
    homepageScreenshotUrl,
  } = adapter(businessReport ?? {});
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
                riskIndicators={riskIndicators}
                riskLevels={riskLevels}
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
              companyName={businessReport?.companyName ?? ''}
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
              detectedMcc={detectedMcc}
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
      adsAndSocialMediaAnalysis,
      adsAndSocialMediaPresence,
      adsImages,
      companyReputationAnalysis,
      ecosystemAndTransactionsAnalysis,
      ecosystemAndTransactionsMatches,
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
  const tabsValues = useMemo(() => tabs.map(tab => tab.value), [tabs]);
  const MerchantMonitoringBusinessReportSearchSchema = z.object({
    activeTab: z
      .enum(
        // @ts-expect-error - zod doesn't like we are using `Array.prototype.map`
        tabsValues,
      )
      .catch(tabsValues[0]!),
  });
  const [{ activeTab }] = useZodSearchParams(MerchantMonitoringBusinessReportSearchSchema);
  const navigate = useNavigate();
  const onNavigateBack = useCallback(() => {
    const previousPath = sessionStorage.getItem(
      'merchant-monitoring:business-report:previous-path',
    );

    if (!previousPath) {
      navigate('../');

      return;
    }

    navigate(previousPath);
    sessionStorage.removeItem('merchant-monitoring:business-report:previous-path');
  }, [navigate]);
  const statusToBadgeData = {
    [BusinessReportStatus.COMPLETED]: { variant: 'info', text: 'Manual Review' },
    [BusinessReportStatus.IN_PROGRESS]: { variant: 'violet', text: 'In-progress' },
    [BusinessReportStatus.NEW]: { variant: 'secondary', text: 'New' },
  } as const;

  const websiteWithNoProtocol = safeUrl(businessReport?.website)?.hostname;

  return {
    onNavigateBack,
    websiteWithNoProtocol,
    businessReport,
    statusToBadgeData,
    tabs,
    activeTab,
  };
};
