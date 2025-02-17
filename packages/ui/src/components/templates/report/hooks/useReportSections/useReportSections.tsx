import { ContentTooltip } from '@/components/molecules/ContentTooltip/ContentTooltip';
import { ReportSchema } from '@ballerine/common';
import {
  BuildingIcon,
  Crown,
  FactoryIcon,
  Globe,
  ListChecksIcon,
  SearchCheck,
  ThumbsUp,
} from 'lucide-react';
import { ReactNode } from 'react';
import { z } from 'zod';

import { getUniqueRiskIndicators } from '@/common';
import {
  AdsAndSocialMedia,
  BusinessReportSummary,
  Ecosystem,
  Transactions,
  WebsiteCredibility,
  WebsiteLineOfBusiness,
  WebsitesCompany,
} from '@/components';

type BusinessReportSection = {
  id: string;
  label: string;
  icon?: ReactNode;
  title: ReactNode | ReactNode[];
  component: ReactNode | ReactNode[];
};

export const useReportSections = ({ report }: { report: z.infer<typeof ReportSchema> }) => {
  const {
    summary,
    companyName,
    riskLevel,
    ongoingMonitoringSummary,
    homePageScreenshotUrl,
    companyReputationRiskIndicators,
    lineOfBusiness,
    mcc,
    mccDescription,
    contentRiskIndicators,
    trafficSources,
    monthlyVisits,
    pagesPerVisit,
    timeOnSite,
    bounceRate,
    websiteReputationRiskIndicators,
    pricingRiskIndicators,
    websiteStructureRiskIndicators,
    trafficRiskIndicators,
    ecosystem,
    facebookPage,
    instagramPage,
  } = report.data ?? {};

  const sections: BusinessReportSection[] = [
    {
      id: 'summary',
      label: 'Summary',
      icon: <ListChecksIcon />,
      title: (
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
      ),
      component: (
        <BusinessReportSummary
          summary={summary ?? ''}
          ongoingMonitoringSummary={ongoingMonitoringSummary ?? ''}
          riskLevel={riskLevel ?? null}
          riskIndicators={[
            {
              title: 'Company Analysis',
              indicators: getUniqueRiskIndicators(companyReputationRiskIndicators ?? []),
            },
            {
              title: 'Credibility Analysis',
              indicators: getUniqueRiskIndicators([
                ...(websiteReputationRiskIndicators ?? []),
                ...(pricingRiskIndicators ?? []),
                ...(websiteStructureRiskIndicators ?? []),
                ...(trafficRiskIndicators ?? []),
              ]),
            },
            {
              title: 'Line of Business Analysis',
              indicators: getUniqueRiskIndicators(contentRiskIndicators ?? []),
            },
          ]}
          homepageScreenshotUrl={homePageScreenshotUrl ?? ''}
        />
      ),
    },
    {
      id: 'company',
      label: 'Company',
      icon: <BuildingIcon />,
      title: (
        <ContentTooltip
          description={
            <p>
              Evaluates the company&apos;s reputation using customer feedback, reviews, and media
              coverage. Identifies trust issues and potential red flags.
            </p>
          }
          props={{
            tooltipContent: {
              align: 'center',
            },
          }}
        >
          <h3 className={'text-lg font-bold'}>
            Website&apos;s Company Analysis
            {companyName && companyName !== `N/A` && ` - ${companyName}`}
          </h3>
        </ContentTooltip>
      ),
      component: (
        <WebsitesCompany
          companyName={companyName ?? ''}
          riskIndicators={companyReputationRiskIndicators ?? []}
        />
      ),
    },
    {
      id: 'line-of-business',
      label: 'Line of Business',
      icon: <FactoryIcon />,
      title: (
        <ContentTooltip
          description={<p>Reviews the company&apos;s industry and market segment.</p>}
          props={{
            tooltipContent: {
              align: 'center',
            },
          }}
        >
          <h3 className={'col-span-full text-lg font-bold'}>Website Line of Business Analysis</h3>
        </ContentTooltip>
      ),
      component: (
        <WebsiteLineOfBusiness
          lineOfBusinessDescription={lineOfBusiness ?? null}
          riskIndicators={contentRiskIndicators ?? []}
          mcc={mcc ?? null}
          mccDescription={mccDescription ?? null}
        />
      ),
    },
    {
      id: 'credibility',
      label: 'Website Credibility',
      icon: <SearchCheck />,
      title: (
        <ContentTooltip
          description={
            <p>
              Evaluates the trustworthiness of the website, based on various factors, including its
              security measures, design, and user feedback.
            </p>
          }
          props={{
            tooltipContent: {
              align: 'center',
            },
          }}
        >
          <h3 className="col-span-full text-lg font-bold">Website Credibility Analysis</h3>
        </ContentTooltip>
      ),
      component: (
        <WebsiteCredibility
          trafficData={{
            trafficSources: trafficSources,
            monthlyVisits: monthlyVisits,
            pagesPerVisit: pagesPerVisit,
            timeOnSite: timeOnSite,
            bounceRate: bounceRate,
          }}
          websiteReputationRiskIndicators={websiteReputationRiskIndicators ?? []}
          pricingRiskIndicators={pricingRiskIndicators ?? []}
          websiteStructureRiskIndicators={websiteStructureRiskIndicators ?? []}
          trafficRiskIndicators={trafficRiskIndicators ?? []}
        />
      ),
    },
    {
      id: 'ecosystem',
      label: 'Ecosystem',
      icon: <Globe />,
      title: (
        <ContentTooltip
          description={
            <p>
              Explores the merchant&apos;s broader activity, including related websites and
              affiliations, for a comprehensive risk assessment.
            </p>
          }
          props={{
            tooltipContent: {
              align: 'center',
            },
          }}
        >
          <h3 className={'col-span-full text-lg font-bold'}>Ecosystem Analysis</h3>
        </ContentTooltip>
      ),
      component: <Ecosystem data={ecosystem ?? []} />,
    },
    {
      id: 'ads-and-social-media',
      label: 'Social Media',
      icon: <ThumbsUp />,
      title: (
        <ContentTooltip
          description={<p>Reviews the merchant&apos;s social media presence.</p>}
          props={{
            tooltipContent: {
              align: 'center',
            },
          }}
        >
          <h2 className="text-lg font-bold">Social Media Analysis</h2>
        </ContentTooltip>
      ),
      component: (
        <AdsAndSocialMedia facebook={facebookPage ?? null} instagram={instagramPage ?? null} />
      ),
    },
    {
      id: 'transactions',
      label: 'Transactions',
      // icon: <Crown className={`d-4 rounded-full`} />,
      title: (
        <div className={`flex items-center space-x-2`}>
          <span>Transaction Analysis</span>
          <Crown className={`d-4 rounded-full`} />
        </div>
      ),
      component: <Transactions />,
    },
  ] as const;

  return { sections };
};
