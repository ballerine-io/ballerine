import { ReportSchema } from '@ballerine/common';
import { Button, ContentTooltip, ctw, useReportSections } from '@ballerine/ui';
import { AlertTriangle, ArrowLeftToLine, ArrowRightToLine, Crown } from 'lucide-react';
import React, { forwardRef, MutableRefObject, useEffect, useRef, useState } from 'react';
import { z } from 'zod';

type BusinessReportProps = {
  report: z.infer<typeof ReportSchema>;
  disableSectionObserver?: boolean;
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
  const [activeSection, setActiveSection] = useState<string>('');
  const lastScrollTime = useRef(Date.now());

  // Set initial active section
  useEffect(() => {
    if (sections.length > 0 && !activeSection) {
      setActiveSection(sections[0]!.id);
    }
  }, [sections, activeSection]);

  useEffect(() => {
    const determineActiveSection = () => {
      // Throttle updates
      const now = Date.now();

      if (now - lastScrollTime.current < 100) {
        return;
      }

      lastScrollTime.current = now;

      const viewportHeight = window.innerHeight;
      const scrollPosition = window.scrollY;
      const documentHeight = document.body.offsetHeight;
      const threshold = 100; // pixels
      const sectionEntries = Object.entries(sectionRefs.current);

      // Handle bottom of page (bottom 15%)
      const isNearBottom = (scrollPosition + viewportHeight) / documentHeight > 0.85;

      if (isNearBottom) {
        // Find visible sections
        const visibleSections = sectionEntries
          .filter(([_, el]) => el !== null)
          .map(([id, el]) => {
            const rect = el!.getBoundingClientRect();
            const visibleTop = Math.max(0, rect.top);
            const visibleBottom = Math.min(viewportHeight, rect.bottom);
            const visibleArea = Math.max(0, visibleBottom - visibleTop);

            return {
              id,
              visibleArea,
              bottomPosition: rect.bottom,
            };
          })
          .filter(section => section.visibleArea > 0);

        // Look for sections in the bottom part of viewport
        if (visibleSections.length > 0) {
          const bottomSections = visibleSections.filter(
            section => section.bottomPosition >= viewportHeight * 0.7,
          );

          if (bottomSections.length > 0) {
            // Find section with bottom closest to viewport bottom
            bottomSections.sort(
              (a, b) =>
                Math.abs(viewportHeight - a.bottomPosition) -
                Math.abs(viewportHeight - b.bottomPosition),
            );
            const newId = bottomSections.at(0)?.id;

            if (newId) {
              setActiveSection(newId);
            }

            return;
          }
        }

        // At very bottom with no visible sections
        if (scrollPosition + viewportHeight >= documentHeight - 50 && sections.length > 0) {
          const newActive = sections[sections.length - 1]?.id;

          if (newActive) {
            setActiveSection(newActive);
          }

          return;
        }
      }

      // Regular case: find sections near the top of viewport
      const topSections = sectionEntries
        .filter(([_, el]) => el !== null)
        .map(([id, el]) => {
          const rect = el!.getBoundingClientRect();
          const distance = Math.abs(rect.top);
          const isVisible = rect.top < viewportHeight && rect.bottom > 0;

          return { id, distance, isVisible };
        })
        .filter(section => section.isVisible || section.distance < threshold)
        .sort((a, b) => a.distance - b.distance);

      if (topSections.length > 0) {
        const newId = topSections.at(0)?.id;

        if (newId) {
          setActiveSection(newId);
        }

        return;
      }

      // Find most visible section
      const visibleSections = sectionEntries
        .filter(([_, el]) => el !== null)
        .map(([id, el]) => {
          const rect = el!.getBoundingClientRect();
          const visibleTop = Math.max(0, rect.top);
          const visibleBottom = Math.min(viewportHeight, rect.bottom);
          const visibleHeight = Math.max(0, visibleBottom - visibleTop);

          return { id, visibleHeight };
        })
        .filter(section => section.visibleHeight > 0)
        .sort((a, b) => b.visibleHeight - a.visibleHeight);

      if (visibleSections.length > 0) {
        const newId = visibleSections.at(0)?.id;

        if (newId) {
          setActiveSection(newId);
        }

        return;
      }

      // At top of page
      if (scrollPosition < 50 && sections.length > 0) {
        const newId = sections.at(0)?.id;

        if (newId) {
          setActiveSection(newId);
        }
      }
    };

    // Run once on mount and whenever scroll happens
    determineActiveSection();
    window.addEventListener('scroll', determineActiveSection, { passive: true });

    return () => window.removeEventListener('scroll', determineActiveSection);
  }, [sections, sectionRefs]);

  const scrollToSection = (sectionId: string) => {
    // Update active section immediately for better UX
    setActiveSection(sectionId);

    // Scroll to the section
    sectionRefs.current[sectionId]?.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Prevent immediate section changes during scroll animation
    lastScrollTime.current = Date.now() + 1000;
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

export const BusinessReport = forwardRef<HTMLDivElement, BusinessReportProps>(
  ({ report, disableSectionObserver = false }, ref) => {
    const { sections } = useReportSections(report);
    const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

    return (
      <div className={`flex transition-all duration-300`}>
        <div className={`flex-1 overflow-y-visible transition-all duration-300`} ref={ref}>
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
                className="min-h-[100px]" // Minimum height helps with detection
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

        {!disableSectionObserver && (
          <BusinessReportSectionsObserver sections={sections} sectionRefs={sectionRefs} />
        )}
      </div>
    );
  },
);

BusinessReport.displayName = 'BusinessReport';
