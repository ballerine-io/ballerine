import { ReportSchema } from '@ballerine/common';
import { ContentTooltip, useReportSections } from '@ballerine/ui';
import { AlertTriangle, ArrowLeftToLine, ArrowRightToLine, Crown } from 'lucide-react';
import { MutableRefObject, useEffect, useRef, useState } from 'react';
import { z } from 'zod';

import { Button } from '@/common/components/atoms/Button/Button';
import { ctw } from '@/common/utils/ctw/ctw';

type BusinessReportProps = {
  report: z.infer<typeof ReportSchema>;
};

const BusinessReportSectionsObserver = ({
  sections,
  sectionRefs,
}: {
  sections: ReturnType<typeof useReportSections>['sections'];
  sectionRefs: MutableRefObject<{
    [key: string]: HTMLDivElement | null;
  }>;
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window ? window.innerWidth >= 1600 : true);
  const [activeSection, setActiveSection] = useState<string>(sections[0]!.id);

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
  }, [sectionRefs]);

  const scrollToSection = (sectionId: string) => {
    sectionRefs.current[sectionId]?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav
      aria-label="Report Scroll Tracker"
      className={ctw(
        'sticky top-0 h-screen overflow-hidden p-4 text-sm transition-all duration-300',
        isSidebarOpen ? 'w-60' : 'w-16',
      )}
    >
      <div className="mb-4 flex items-center">
        {isSidebarOpen && <h2 className="text-base font-bold">Sections</h2>}
        <Button
          variant="secondary"
          size="icon"
          className="ml-auto d-7"
          onClick={() => setIsSidebarOpen(prev => !prev)}
        >
          {isSidebarOpen ? (
            <ArrowRightToLine className="d-5" />
          ) : (
            <ArrowLeftToLine className="d-5" />
          )}
        </Button>
      </div>

      <ul className="space-y-3">
        {sections.map(section => (
          <ContentTooltip
            key={section.id}
            description={section.label ?? section.title}
            props={{
              tooltipTrigger: { asChild: true, className: 'pr-0 text-sm' },
              tooltipContent: { className: ctw('p-1', isSidebarOpen && 'hidden') },
            }}
          >
            <li
              className={ctw(
                'mb-2 flex cursor-pointer items-center gap-2 text-slate-500',
                activeSection === section.id && 'font-bold text-slate-900',
                !isSidebarOpen && 'pl-2',
              )}
              onClick={() => scrollToSection(section.id)}
            >
              {section.Icon && <section.Icon className="d-5" />}
              <span className={isSidebarOpen ? 'block' : 'hidden'}>
                {section.label ?? section.title}
              </span>
              {section.hasViolations && isSidebarOpen && (
                <AlertTriangle className="ml-auto inline-block fill-warning text-white d-5" />
              )}
              {section.isPremium && isSidebarOpen && (
                <Crown className="ml-auto mr-0.5 inline-block text-slate-400 d-4" />
              )}
            </li>
          </ContentTooltip>
        ))}
      </ul>
    </nav>
  );
};

export const BusinessReport = ({ report }: BusinessReportProps) => {
  const { sections } = useReportSections(report);
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  return (
    <div className={`flex transition-all duration-300`}>
      <div className={`flex-1 overflow-y-visible transition-all duration-300`}>
        {sections.map(section => {
          const titleContent = (
            <div className="mb-6 mt-8 flex items-center gap-2 text-lg font-bold">
              {section.Icon && <section.Icon className="d-6" />}
              <span>{section.title}</span>
            </div>
          );

          return (
            <div
              key={section.id}
              id={section.id}
              ref={el => (sectionRefs.current[section.id] = el)}
            >
              {section.description ? (
                <ContentTooltip description={section.description}>{titleContent}</ContentTooltip>
              ) : (
                <>{titleContent}</>
              )}

              {section.Component}
            </div>
          );
        })}
      </div>

      <BusinessReportSectionsObserver sections={sections} sectionRefs={sectionRefs} />
    </div>
  );
};
