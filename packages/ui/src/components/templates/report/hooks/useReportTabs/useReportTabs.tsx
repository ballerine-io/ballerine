import { Crown } from 'lucide-react';
import { ComponentProps, ReactNode } from 'react';
import { ContentTooltip } from '@/components/molecules/ContentTooltip/ContentTooltip';

import {
  AdsAndSocialMedia,
  BusinessReportSummary,
  Ecosystem,
  Transactions,
  WebsiteCredibility,
  WebsiteLineOfBusiness,
  WebsitesCompany,
} from '@/components';
import { z } from 'zod';
import { ReportSchema, RiskIndicatorSchema } from '@ballerine/common';
import { getUniqueRiskIndicators } from '@/common';

type UseReportTabsProps = {
  report: z.infer<typeof ReportSchema>;
  Link: ComponentProps<typeof BusinessReportSummary>['Link'];
};

export const useReportTabs = ({ report, Link }: UseReportTabsProps) => {
  const sectionsSummary: ReadonlyArray<{
    title: string;
    search: string;
    indicators: Array<z.infer<typeof RiskIndicatorSchema>> | null;
  }> = [
    {
      title: "Website's Company Analysis",
      search: '?activeTab=websitesCompany',
      indicators: getUniqueRiskIndicators(report.data?.companyReputationRiskIndicators ?? []),
    },
    {
      title: 'Website Credibility Analysis',
      search: '?activeTab=websiteCredibility',
      indicators: getUniqueRiskIndicators([
        ...(report.data?.websiteReputationRiskIndicators ?? []),
        ...(report.data?.pricingRiskIndicators ?? []),
        ...(report.data?.websiteStructureRiskIndicators ?? []),
        ...(report.data?.trafficRiskIndicators ?? []),
      ]),
    },
    {
      title: 'Social Media Analysis',
      search: '?activeTab=adsAndSocialMedia',
      indicators: null,
    },
    {
      title: 'Website Line of Business Analysis',
      search: '?activeTab=websiteLineOfBusiness',
      indicators: getUniqueRiskIndicators(report.data?.contentRiskIndicators ?? []),
    },
    {
      title: 'Ecosystem Analysis',
      search: '?activeTab=ecosystem',
      indicators: null,
    },
    {
      title: 'Transactions Analysis',
      search: '?activeTab=transactions',
      indicators: null,
    },
  ] as const;

  const tabs = [
    {
      label: 'Summary',
      value: 'summary',
      content: (
        <>
          <ContentTooltip
            description={
              <p>
                Provides a concise overview of the merchant&apos;s risk level, integrating various
                factors into a clear summary for informed decisions.
              </p>
            }
            props={{
              tooltipContent: {
                className: 'max-w-[400px] whitespace-normal',
              },
              tooltipTrigger: {
                className: 'col-span-full text-lg font-bold',
              },
            }}
          >
            <h3 className={'mb-8 text-lg font-bold'}>Summary</h3>
          </ContentTooltip>

          <BusinessReportSummary
            summary={report.data?.summary ?? ''}
            ongoingMonitoringSummary={report.data?.ongoingMonitoringSummary ?? ''}
            riskLevel={report.data?.riskLevel ?? null}
            riskIndicators={sectionsSummary}
            Link={Link}
            homepageScreenshotUrl={report.data?.homePageScreenshotUrl ?? ''}
          />
        </>
      ),
    },
    {
      label: "Website's Company",
      value: 'websitesCompany',
      content: (
        <WebsitesCompany riskIndicators={report.data?.companyReputationRiskIndicators ?? []} />
      ),
    },
    {
      label: 'Website Line of Business',
      value: 'websiteLineOfBusiness',
      content: (
        <WebsiteLineOfBusiness
          lineOfBusinessDescription={report.data?.lineOfBusiness ?? null}
          riskIndicators={report.data?.contentRiskIndicators ?? []}
          mcc={report.data?.mcc ?? null}
          mccDescription={report.data?.mccDescription ?? null}
        />
      ),
    },
    {
      label: 'Website Credibility',
      value: 'websiteCredibility',
      content: (
        <WebsiteCredibility
          trafficData={{
            trafficSources: report.data?.trafficSources,
            monthlyVisits: report.data?.monthlyVisits,
            pagesPerVisit: report.data?.pagesPerVisit,
            timeOnSite: report.data?.timeOnSite,
            bounceRate: report.data?.bounceRate,
          }}
          websiteReputationRiskIndicators={report.data?.websiteReputationRiskIndicators ?? []}
          pricingRiskIndicators={report.data?.pricingRiskIndicators ?? []}
          websiteStructureRiskIndicators={report.data?.websiteStructureRiskIndicators ?? []}
          trafficRiskIndicators={report.data?.trafficRiskIndicators ?? []}
        />
      ),
    },
    {
      label: 'Ecosystem',
      value: 'ecosystem',
      content: <Ecosystem data={report.data?.ecosystem ?? []} />,
    },
    {
      label: 'Social Media',
      value: 'adsAndSocialMedia',
      content: (
        <AdsAndSocialMedia
          facebook={report.data?.facebookPage ?? null}
          instagram={report.data?.instagramPage ?? null}
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
  }>;

  return {
    tabs,
    sectionsSummary,
  };
};
