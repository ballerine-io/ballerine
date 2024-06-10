import React, { FunctionComponent, ReactNode, useCallback, useMemo } from 'react';
import { Tabs } from '@/common/components/organisms/Tabs/Tabs';
import { TabsList } from '@/common/components/organisms/Tabs/Tabs.List';
import { TabsTrigger } from '@/common/components/organisms/Tabs/Tabs.Trigger';
import { TabsContent } from '@/common/components/organisms/Tabs/Tabs.Content';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/common/components/atoms/Button/Button';
import { useZodSearchParams } from '@/common/hooks/useZodSearchParams/useZodSearchParams';
import { z } from 'zod';
import { Badge } from '@ballerine/ui';
import { ctw } from '@/common/utils/ctw/ctw';
import { BusinessReportStatus } from '@/domains/business-reports/fetchers';
import dayjs from 'dayjs';
import { useBusinessReportByIdQuery } from '@/domains/business-reports/hooks/queries/useBusinessReportByIdQuery/useBusinessReportByIdQuery';
import { ScrollArea } from '@/common/components/molecules/ScrollArea/ScrollArea';
import { BusinessReportSummary } from '@/common/components/molecules/BusinessReportSummary/BusinessReportSummary';
import { WebsiteLineOfBusiness } from '@/domains/business-reports/components/WebsiteLineOfBusiness/WebsiteLineOfBusiness';
import { WebsitesCompany } from '@/domains/business-reports/components/WebsitesCompany/WebsitesCompany';
import { WebsiteCredibility } from '@/domains/business-reports/components/WebsiteCredibility/WebsiteCredibility';
import { EcosystemAndTransactions } from '@/domains/business-reports/components/EcosystemAndTransactions/EcosystemAndTransactions';
import { AdsAndSocialMedia } from '@/domains/business-reports/components/AdsAndSocialMedia/AdsAndSocialMedia';
import { TextWithNAFallback } from '@/common/components/atoms/TextWithNAFallback/TextWithNAFallback';
import { safeUrl } from '@/common/utils/safe-url/safe-url';

import { createReportAdapter } from '@/domains/business-reports/create-report-adapter/create-report-adapter';

export const MerchantMonitoringBusinessReport: FunctionComponent = () => {
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
      title: 'Ecosystem and Transactions Analysis View',
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
            <BusinessReportSummary
              summary={summary}
              riskScore={riskScore}
              riskIndicators={riskIndicators}
              recommendations={recommendations ?? []}
              riskLevels={riskLevels}
            />
          ),
        },
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
      recommendations,
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
  } as const;
  const websiteWithNoProtocol = safeUrl(businessReport?.business?.website ?? '')?.hostname;

  return (
    <section className="flex h-full flex-col px-6 pb-6 pt-4">
      <div>
        <Button
          variant={'ghost'}
          onClick={onNavigateBack}
          className={'mb-6 flex items-center space-x-[1px] pe-3 ps-1 font-semibold'}
        >
          <ChevronLeft size={18} /> <span>Back</span>
        </Button>
      </div>
      <TextWithNAFallback as={'h2'} className="pb-4 text-2xl font-bold">
        {websiteWithNoProtocol}
      </TextWithNAFallback>
      <div className={`flex space-x-8`}>
        <div className={`flex items-center pb-4`}>
          <span className={`me-4 text-sm leading-6 text-slate-400`}>Status</span>
          <Badge
            variant={
              statusToBadgeData[businessReport?.status as keyof typeof statusToBadgeData]?.variant
            }
            className={ctw(`text-sm font-bold`, {
              'bg-info/20 text-info': businessReport?.status === BusinessReportStatus.COMPLETED,
            })}
          >
            {statusToBadgeData[businessReport?.status as keyof typeof statusToBadgeData]?.text}
          </Badge>
        </div>
        <div>
          <span className={`me-2 text-sm leading-6 text-slate-400`}>Created at</span>
          {businessReport?.createdAt &&
            dayjs(new Date(businessReport?.createdAt)).format('HH:mm MMM Do, YYYY')}
        </div>
      </div>
      <Tabs defaultValue={activeTab} className="w-full" key={activeTab}>
        <TabsList className={'mb-4'}>
          {tabs.map(tab => (
            <TabsTrigger key={tab.value} value={tab.value} asChild>
              <Link
                to={{
                  search: `?activeTab=${tab.value}`,
                }}
              >
                {tab.label}
              </Link>
            </TabsTrigger>
          ))}
        </TabsList>
        <ScrollArea orientation={'vertical'} className={'h-[75vh]'}>
          {tabs.map(tab => (
            <TabsContent key={tab.value} value={tab.value}>
              {tab.content}
            </TabsContent>
          ))}
        </ScrollArea>
      </Tabs>
    </section>
  );
};
