import { ctw, useReportSections } from '@ballerine/ui';
import { AlertTriangle, ArrowLeftToLine, ArrowRightToLine, Crown } from 'lucide-react';
import { Dispatch, MutableRefObject, SetStateAction, useEffect, useState } from 'react';

import { Button } from '@/common/components/atoms/Button/Button';

export const BusinessReportSectionsObserver = ({
  sections,
  sectionRefs,
  isSidebarOpen,
  setIsSidebarOpen,
}: {
  sections: ReturnType<typeof useReportSections>['sections'];
  sectionRefs: MutableRefObject<{
    [key: string]: HTMLDivElement | null;
  }>;
  isSidebarOpen: boolean;
  setIsSidebarOpen: Dispatch<SetStateAction<boolean>>;
}) => {
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
        'sticky top-0 h-screen overflow-hidden p-4 transition-all duration-300',
        isSidebarOpen ? 'w-60' : 'w-16', // Adjust width for collapsed state
      )}
    >
      <div className="mb-4 flex items-center">
        {isSidebarOpen && <h2 className="text-lg font-bold">Sections</h2>}
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
          <li
            key={section.id}
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
        ))}
      </ul>
    </nav>
  );
};
