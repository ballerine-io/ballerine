import { ReportSchema } from '@ballerine/common';
import {
  BuildingIcon,
  FactoryIcon,
  Globe,
  ListChecksIcon,
  LucideIcon,
  SearchCheck,
  ThumbsUp,
} from 'lucide-react';
import { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
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
import { CreditCard } from 'lucide-react';

type BusinessReportSection = {
  id: string;
  title: string;
  description?: string;
  Icon?: LucideIcon;
  Component: ReactNode;
  label?: string;
  hasViolations?: boolean;
  isPremium?: boolean;
};

export const useReportSections = ({ report }: { report: z.infer<typeof ReportSchema> }) => {
  const {
    homePageScreenshotUrl,
    riskLevel,
    summary,
    ongoingMonitoringSummary,

    companyReputationRiskIndicators,
    contentRiskIndicators,
    websiteReputationRiskIndicators,
    pricingRiskIndicators,
    websiteStructureRiskIndicators,
    trafficRiskIndicators,

    lineOfBusiness,

    mcc,
    mccDescription,

    trafficSources,
    monthlyVisits,
    pagesPerVisit,
    timeOnSite,
    bounceRate,

    ecosystem,

    facebookPage,
    instagramPage,
  } = report.data ?? {};

  const sections = useMemo(
    () =>
      [
        {
          id: 'summary',
          title: 'Summary',
          description:
            "Provides a concise overview of the merchant's risk level, integrating various factors into a clear summary for informed decisions.",
          Icon: ListChecksIcon,
          Component: (
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
                  title: 'Line of Business Analysis',
                  indicators: getUniqueRiskIndicators(contentRiskIndicators ?? []),
                },
                {
                  title: 'Website Credibility Analysis',
                  indicators: getUniqueRiskIndicators([
                    ...(websiteReputationRiskIndicators ?? []),
                    ...(pricingRiskIndicators ?? []),
                    ...(websiteStructureRiskIndicators ?? []),
                    ...(trafficRiskIndicators ?? []),
                  ]),
                },
              ]}
              homepageScreenshotUrl={homePageScreenshotUrl ?? ''}
            />
          ),
        },
        {
          id: 'company',
          title: 'Company Analysis',
          label: 'Company',
          description:
            "Evaluates the company's reputation using customer feedback, reviews, and media coverage. Identifies trust issues and potential red flags.",
          Icon: BuildingIcon,
          hasViolations: getUniqueRiskIndicators(companyReputationRiskIndicators ?? []).length > 0,
          Component: <WebsitesCompany riskIndicators={companyReputationRiskIndicators ?? []} />,
        },
        {
          id: 'line-of-business',
          title: 'Line of Business',
          description: "Reviews the company's industry and market segment.",
          Icon: FactoryIcon,
          hasViolations: getUniqueRiskIndicators(contentRiskIndicators ?? []).length > 0,
          Component: (
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
          title: 'Website Credibility',
          description:
            'Evaluates the trustworthiness of the website, based on various factors, including its security measures, design, and user feedback.',
          Icon: SearchCheck,
          hasViolations:
            getUniqueRiskIndicators([
              ...(websiteReputationRiskIndicators ?? []),
              ...(pricingRiskIndicators ?? []),
              ...(websiteStructureRiskIndicators ?? []),
              ...(trafficRiskIndicators ?? []),
            ]).length > 0,
          Component: (
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
          title: 'Ecosystem',
          description:
            "Explores the merchant's broader activity, including related websites and affiliations, for a comprehensive risk assessment.",
          Icon: Globe,
          Component: <Ecosystem data={ecosystem ?? []} />,
        },
        {
          id: 'ads-and-social-media',
          title: 'Social Media',
          description: "Reviews the merchant's social media presence.",
          Icon: ThumbsUp,
          Component: (
            <AdsAndSocialMedia facebook={facebookPage ?? null} instagram={instagramPage ?? null} />
          ),
        },
        {
          id: 'transactions',
          title: 'Transactions',
          Icon: CreditCard,
          Component: <Transactions />,
          isPremium: true,
        },
      ] as BusinessReportSection[],
    [report.data],
  );

  const [activeSection, setActiveSection] = useState<string>(sections[0]!.id);

  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const parentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observerCallback: IntersectionObserverCallback = entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && activeSection !== entry.target.id) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.1,
    });

    Object.values(sectionRefs.current).forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [activeSection]);

  const scrollToSection = (sectionId: string) => {
    sectionRefs.current[sectionId]?.scrollIntoView({ behavior: 'smooth' });
  };

  return { sections, activeSection, sectionRefs, parentRef, scrollToSection };
};
