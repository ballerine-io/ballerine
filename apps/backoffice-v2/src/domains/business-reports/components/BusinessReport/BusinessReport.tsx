import {
  AdsAndSocialMedia,
  BusinessReportSummary,
  ContentTooltip,
  getUniqueRiskIndicators,
  Transactions,
  WebsiteCredibility,
  WebsiteLineOfBusiness,
  WebsitesCompany,
} from '@ballerine/ui';
import { ReportSchema, RiskIndicatorSchema } from '@ballerine/common';
import { z } from 'zod';

type BusinessReportProps = {
  report: z.infer<typeof ReportSchema>;
};

export const BusinessReport = ({ report }: BusinessReportProps) => {
  const sectionsSummary = [
    {
      title: 'Company Analysis',
      riskIndicators: getUniqueRiskIndicators(report.data?.companyReputationRiskIndicators ?? []),
    },
    {
      title: 'Credibility Analysis',
      riskIndicators: getUniqueRiskIndicators([
        ...(report.data?.websiteReputationRiskIndicators ?? []),
        ...(report.data?.pricingRiskIndicators ?? []),
        ...(report.data?.websiteStructureRiskIndicators ?? []),
        ...(report.data?.trafficRiskIndicators ?? []),
      ]),
    },
    {
      title: 'Line of Business Analysis',
      riskIndicators: getUniqueRiskIndicators(report.data?.contentRiskIndicators ?? []),
    },
  ] as const satisfies ReadonlyArray<{
    title: string;
    riskIndicators: Array<z.infer<typeof RiskIndicatorSchema>>;
  }>;

  return (
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
        sections={sectionsSummary}
        homepageScreenshotUrl={report.data?.homePageScreenshotUrl ?? ''}
      />

      <WebsitesCompany
        companyName={report.data?.companyName ?? ''}
        riskIndicators={report.data?.companyReputationRiskIndicators ?? []}
      />

      <WebsiteLineOfBusiness
        lineOfBusinessDescription={report.data?.lineOfBusiness ?? null}
        riskIndicators={report.data?.contentRiskIndicators ?? []}
        mcc={report.data?.mcc ?? null}
        mccDescription={report.data?.mccDescription ?? null}
      />

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

      <AdsAndSocialMedia
        facebook={report.data?.facebookPage ?? null}
        instagram={report.data?.instagramPage ?? null}
      />

      <Transactions />
    </>
  );
};
