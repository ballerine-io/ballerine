import { Crown } from 'lucide-react';
import { ComponentProps, ReactNode, useMemo } from 'react';
import { Writable } from 'type-fest';
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
import { MERCHANT_REPORT_STATUSES, MERCHANT_REPORT_TYPES } from '../../constants';
import { ReportSchema, RiskIndicatorRiskLevel, RiskIndicatorSchema } from '@ballerine/common';
import { getUniqueRiskIndicators } from '@/common';

type UseReportTabsProps = {
  report: z.infer<typeof ReportSchema>;
  Link: ComponentProps<typeof BusinessReportSummary>['Link'];
};

export const useReportTabs = ({ report, Link }: UseReportTabsProps) => {
  const sectionsSummary = [
    {
      title: "Website's Company Analysis",
      search: '?activeTab=websitesCompany',
      riskIndicators: getUniqueRiskIndicators(report.data?.companyReputationRiskIndicators ?? []),
    },
    {
      title: 'Website Credibility Analysis',
      search: '?activeTab=websiteCredibility',
      riskIndicators: getUniqueRiskIndicators([
        ...(report.data?.websiteReputationRiskIndicators ?? []),
        ...(report.data?.pricingRiskIndicators ?? []),
        ...(report.data?.websiteStructureRiskIndicators ?? []),
        ...(report.data?.trafficRiskIndicators ?? []),
      ]),
    },
    {
      title: 'Social Media Analysis',
      search: '?activeTab=adsAndSocialMedia',
      riskIndicators: null,
    },
    {
      title: 'Website Line of Business Analysis',
      search: '?activeTab=websiteLineOfBusiness',
      riskIndicators: getUniqueRiskIndicators(report.data?.contentRiskIndicators ?? []),
    },
    {
      title: 'Ecosystem Analysis',
      search: '?activeTab=ecosystem',
      riskIndicators: null,
    },
    {
      title: 'Transactions Analysis',
      search: '?activeTab=transactions',
      riskIndicators: null,
    },
  ] as const satisfies ReadonlyArray<{
    title: string;
    search: string;
    riskIndicators: z.infer<typeof RiskIndicatorSchema>[] | null;
  }>;

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
            riskLevel={report.data?.riskLevel!}
            sections={sectionsSummary}
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
        <WebsitesCompany
          companyName={report.data?.companyName ?? ''}
          riskIndicators={report.data?.companyReputationRiskIndicators ?? []}
        />
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
