import { ReportSchema } from '@ballerine/common';
import {
  AdsAndSocialMedia,
  BusinessReportSummary,
  ContentTooltip,
  getUniqueRiskIndicators,
  Transactions,
  useReportSections,
  WebsiteCredibility,
  WebsiteLineOfBusiness,
  WebsitesCompany,
} from '@ballerine/ui';
import { AlertTriangle } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { z } from 'zod';

type BusinessReportProps = {
  report: z.infer<typeof ReportSchema>;
};

const getSectionRiskIndicators = (report: z.infer<typeof ReportSchema>) => [
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
];

export const BusinessReport = ({ report }: BusinessReportProps) => {
  const { sections } = useReportSections({ report });
  const [activeSection, setActiveSection] = useState<string>(sections[0]!.id);
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const parentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observerCallback: IntersectionObserverCallback = entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.1, // Trigger when 10% of the section is visible
    });

    Object.values(sectionRefs.current).forEach(ref => {
      if (ref) {
        observer.observe(ref);
      }
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (sectionId: string) => {
    sectionRefs.current[sectionId]?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div ref={parentRef} className="flex w-full gap-2">
      <div className="w-4/5">
        <div id="summary" ref={el => (sectionRefs.current['summary'] = el)}>
          <ContentTooltip
            description={
              <p>
                Provides a concise overview of the merchant&apos;s risk level, integrating various
                factors into a clear summary for informed decisions.
              </p>
            }
            props={{
              tooltipContent: { className: 'max-w-[400px] whitespace-normal' },
              tooltipTrigger: { className: 'col-span-full text-lg font-bold' },
            }}
          >
            <h3 className="mb-8 text-lg font-bold">Summary</h3>
          </ContentTooltip>
          <BusinessReportSummary
            summary={report.data?.summary ?? ''}
            ongoingMonitoringSummary={report.data?.ongoingMonitoringSummary ?? ''}
            riskLevel={report.data?.riskLevel ?? null}
            sections={getSectionRiskIndicators(report)}
            homepageScreenshotUrl={report.data?.homePageScreenshotUrl ?? ''}
          />
        </div>

        <div id="company" ref={el => (sectionRefs.current['company'] = el)}>
          <WebsitesCompany
            companyName={report.data?.companyName ?? ''}
            riskIndicators={report.data?.companyReputationRiskIndicators ?? []}
          />
        </div>

        <div id="line-of-business" ref={el => (sectionRefs.current['line-of-business'] = el)}>
          <WebsiteLineOfBusiness
            lineOfBusinessDescription={report.data?.lineOfBusiness ?? null}
            riskIndicators={report.data?.contentRiskIndicators ?? []}
            mcc={report.data?.mcc ?? null}
            mccDescription={report.data?.mccDescription ?? null}
          />
        </div>

        <div id="credibility" ref={el => (sectionRefs.current['credibility'] = el)}>
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
        </div>

        <div
          id="ads-and-social-media"
          ref={el => (sectionRefs.current['ads-and-social-media'] = el)}
        >
          <AdsAndSocialMedia
            facebook={report.data?.facebookPage ?? null}
            instagram={report.data?.instagramPage ?? null}
          />
        </div>

        <div id="transactions" ref={el => (sectionRefs.current['transactions'] = el)}>
          <Transactions />
        </div>
      </div>

      <nav
        aria-label="Report Scroll Tracker"
        className="sticky top-0 h-screen w-1/5 overflow-y-auto bg-gray-100 p-4"
      >
        <ul>
          {sections.map(section => (
            <li
              key={section.id}
              className={`mb-2 cursor-pointer ${
                activeSection === section.id ? 'font-bold text-blue-600' : ''
              }`}
              onClick={() => scrollToSection(section.id)}
            >
              {section.title}
              {section.hasViolations && (
                <AlertTriangle className="ml-2 inline-block text-red-500" size={16} />
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};
