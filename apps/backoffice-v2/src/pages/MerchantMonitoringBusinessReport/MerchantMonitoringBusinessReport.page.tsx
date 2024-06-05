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
import { AdsProviders } from '@/domains/business-reports/constants';
import { TAdsProvider } from '@/domains/business-reports/types';
import { reportAdapter } from '@/domains/business-reports/adapters/report-adapter/report-adapter';
import { adsProviderAdapter } from '@/domains/business-reports/adapters/ads-provider-adapter/ads-provider-adapter';
import { AdsAndSocialMedia } from '@/domains/business-reports/components/AdsAndSocialMedia/AdsAndSocialMedia';

export const MerchantMonitoringBusinessReport: FunctionComponent = () => {
  const { businessReportId } = useParams();
  const { data: businessReport } = useBusinessReportByIdQuery({
    id: businessReportId ?? '',
  });
  const adapter =
    reportAdapter[`v${businessReport?.report?.version}` as keyof typeof reportAdapter] ??
    reportAdapter.DEFAULT;
  const {
    companyNameViolations,
    adsAndSocialViolations,
    ads,
    lineOfBusinessViolations,
    ecosystemViolations,
    ecosystemDomains,
    tldViolations,
    summary,
    riskScore,
    recommendations,
    riskLevels,
    scamOrFraudIndicators,
    relatedAdsSummary,
    lineOfBusinessDescription,
  } = adapter(businessReport ?? {});
  const websitesCompanyAnalysis = useMemo(
    () =>
      companyNameViolations?.map(({ name, riskLevel }) => ({
        label: name,
        severity: riskLevel,
      })),
    [companyNameViolations],
  );
  const adsAndSocialMediaAnalysis = useMemo(
    () =>
      adsAndSocialViolations?.map(({ name, riskLevel }) => ({
        label: name,
        severity: riskLevel,
      })),
    [adsAndSocialViolations],
  );
  const getLabel = ({ label, provider }: { label: string; provider: string }) => {
    if (label === 'page') {
      return `${provider} Page`;
    }

    return label;
  };
  const adsAndSocialMediaPresence = useMemo(
    () =>
      Object.entries(ads ?? {}).map(([provider, data]) => {
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
      }),
    [adsAndSocialViolations],
  );
  const websiteLineOfBusinessAnalysis = useMemo(
    () =>
      lineOfBusinessViolations?.map(({ name, riskLevel }) => ({
        label: name,
        severity: riskLevel,
      })),
    [lineOfBusinessViolations],
  );
  const ecosystemAndTransactionsAnalysis = useMemo(
    () =>
      ecosystemViolations?.map(({ name, riskLevel }) => ({
        label: name,
        severity: riskLevel,
      })),
    [ecosystemViolations],
  );
  const ecosystemAndTransactionsMatches = useMemo(
    () =>
      ecosystemDomains?.map(({ domain, relatedNode, relatedNodeType, indicator }) => ({
        matchedName: domain,
        relatedNode,
        relatedNodeType: relatedNodeType,
        indicators: {
          label: indicator?.name,
          severity: indicator?.riskLevel,
        },
      })),
    [ecosystemDomains],
  );
  const websiteCredibilityAnalysis = useMemo(
    () =>
      tldViolations?.map(({ name, riskLevel }) => ({
        label: name,
        severity: riskLevel,
      })),
    [tldViolations],
  );
  const riskIndicators = [
    {
      title: "Website's Company Analysis",
      to: '?activeTab=websitesCompany',
      violations: websitesCompanyAnalysis ?? [],
    },
    {
      title: 'Website Credibility Analysis',
      to: '?activeTab=websiteCredibility',
      violations: websiteCredibilityAnalysis,
    },
    {
      title: 'Ads and Social Media Analysis',
      to: '?activeTab=adsAndSocialMedia',
      violations: adsAndSocialMediaAnalysis ?? [],
    },
    {
      title: 'Website Line of Business Analysis',
      to: '?activeTab=websiteLineOfBusiness',
      violations: websiteLineOfBusinessAnalysis ?? [],
    },
    {
      title: 'Ecosystem and Transactions Analysis View',
      to: '?activeTab=ecosystemAndTransactions',
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
  const adsImages = Object.entries(ads ?? {})
    .map(([provider, data]) => ({
      provider,
      src: data?.imageUrl,
      link: data?.adsInformation?.link,
    }))
    .filter(Boolean);

  const relatedAdsImages = Object.values(ads ?? {}).map(data => data?.pickedAd?.link);

  const tabs = [
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
          companyReputationAnalysis={scamOrFraudIndicators ?? []}
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
      content: <WebsiteCredibility violations={websiteCredibilityAnalysis ?? []} />,
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
  }>;
  const tabsValues = tabs.map(tab => tab.value);
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
      <h2 className="pb-4 text-2xl font-bold">{businessReport?.business?.companyName}</h2>
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
