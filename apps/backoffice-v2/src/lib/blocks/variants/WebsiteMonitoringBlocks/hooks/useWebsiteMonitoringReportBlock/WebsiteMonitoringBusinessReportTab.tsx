import { TBusinessReport } from '@/domains/business-reports/fetchers';
import { WebsitesCompany } from '@/domains/business-reports/components/WebsitesCompany/WebsitesCompany';
import { WebsiteLineOfBusiness } from '@/domains/business-reports/components/WebsiteLineOfBusiness/WebsiteLineOfBusiness';
import { WebsiteCredibility } from '@/domains/business-reports/components/WebsiteCredibility/WebsiteCredibility';
import { EcosystemAndTransactions } from '@/domains/business-reports/components/EcosystemAndTransactions/EcosystemAndTransactions';
import { AdsAndSocialMedia } from '@/domains/business-reports/components/AdsAndSocialMedia/AdsAndSocialMedia';
import React, { ReactNode, useCallback, useMemo } from 'react';
import { useSearchParamsByEntity } from '@/common/hooks/useSearchParamsByEntity/useSearchParamsByEntity';
import { Link, useLocation } from 'react-router-dom';
import { BusinessReportSummary } from '@/common/components/molecules/BusinessReportSummary/BusinessReportSummary';
import { Tabs } from '@/common/components/organisms/Tabs/Tabs';
import { TabsList } from '@/common/components/organisms/Tabs/Tabs.List';
import { TabsTrigger } from '@/common/components/organisms/Tabs/Tabs.Trigger';
import { ctw } from '@/common/utils/ctw/ctw';
import { TabsContent } from '@/common/components/organisms/Tabs/Tabs.Content';

import { createReportAdapter } from '@/domains/business-reports/create-report-adapter/create-report-adapter';

export const WebsiteMonitoringBusinessReportTab = ({
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
    ecosystemAndTransactionsAnalysis,
    summary,
    riskScore,
    recommendations,
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
  } = adapter(businessReport ?? {});
  const tabs = useMemo(
    () =>
      [
        {
          label: "Website's Company",
          value: 'websitesCompany',
          content: (
            <WebsitesCompany
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
              summary={lineOfBusinessDescription}
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
      trafficAnalysis,
      websiteCredibilityAnalysis,
      websiteLineOfBusinessAnalysis,
      websiteStructureAndContentEvaluation,
      websitesCompanyAnalysis,
    ],
  );
  const [{ activeTab }] = useSearchParamsByEntity();
  const { search } = useLocation();
  const updateActiveTab = useCallback(({ tab, search }: { tab: string; search: string }) => {
    const searchParams = new URLSearchParams(search);

    searchParams.set('activeTab', tab);

    return searchParams.toString();
  }, []);
  const riskIndicators = [
    {
      title: "Website's Company Analysis",
      to: updateActiveTab({ tab: 'websitesCompany', search }),
      violations: websitesCompanyAnalysis ?? [],
    },
    {
      title: 'Website Credibility Analysis',
      to: updateActiveTab({ tab: 'websiteCredibility', search }),
      violations: websiteCredibilityAnalysis,
    },
    {
      title: 'Ads and Social Media Analysis',
      to: updateActiveTab({ tab: 'adsAndSocialMedia', search }),
      violations: adsAndSocialMediaAnalysis ?? [],
    },
    {
      title: 'Website Line of Business Analysis',
      to: updateActiveTab({ tab: 'websiteLineOfBusiness', search }),
      violations: websiteLineOfBusinessAnalysis ?? [],
    },
    {
      title: 'Ecosystem and Transactions Analysis View',
      to: updateActiveTab({ tab: 'ecosystemAndTransactions', search }),
      violations: ecosystemAndTransactionsAnalysis ?? [],
    },
  ] as const satisfies ReadonlyArray<{
    title: string;
    to: string;
    violations: Array<{
      label: string;
      severity: string;
    }>;
  }>;

  return (
    <div className={'grid gap-y-4'}>
      <BusinessReportSummary
        summary={summary}
        riskLevels={riskLevels}
        riskIndicators={riskIndicators}
        riskScore={riskScore}
        recommendations={recommendations}
      />
      <Tabs defaultValue={activeTab} className="w-full" key={activeTab}>
        <TabsList className={'mb-4 bg-transparent'}>
          {tabs.map(tab => (
            <TabsTrigger key={tab.value} value={tab.value} asChild>
              <Link
                to={{
                  search: updateActiveTab({ tab: tab.value, search }),
                }}
                className={ctw({
                  '!bg-foreground !text-background': activeTab === tab.value,
                })}
              >
                {tab.label}
              </Link>
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map(tab => (
          <TabsContent key={tab.value} value={tab.value}>
            {tab.content}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
