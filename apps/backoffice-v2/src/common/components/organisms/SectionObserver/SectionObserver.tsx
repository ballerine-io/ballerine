import { Button, ctw } from '@ballerine/ui';
import { AlertTriangle, ArrowLeftToLine, ArrowRightToLine, Crown } from 'lucide-react';
import React, { MutableRefObject, useEffect, useRef, useState } from 'react';

type Section = {
  id: string;
  label?: string;
  title: string;
  Icon?: React.ComponentType<{ className?: string }>;
  hasViolations?: boolean;
  isPremium?: boolean;
  Component?: React.ReactNode;
};

type SectionObserverProps<TSection extends Section> = {
  sections: TSection[];
  sectionRefs: MutableRefObject<{ [key: string]: HTMLDivElement | null }>;
  onActiveSectionChange?: (activeSection: string) => void;
  renderSectionItem?: (
    section: TSection,
    isActive: boolean,
    scrollToSection: (id: string) => void,
  ) => React.ReactNode;
  isSidebarOpen?: boolean;
  onSidebarToggle?: (isOpen: boolean) => void;
};

export const SectionObserver = <TSection extends Section>({
  sections,
  sectionRefs,
  onActiveSectionChange,
  renderSectionItem,
  isSidebarOpen: externalSidebarState,
  onSidebarToggle,
}: SectionObserverProps<TSection>) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(externalSidebarState ?? true);
  const [activeSection, setActiveSection] = useState<string>('');
  const lastScrollTime = useRef(Date.now());

  useEffect(() => {
    if (sections.length > 0 && !activeSection) {
      setActiveSection(sections[0]!.id);
    }
  }, [sections, activeSection]);

  useEffect(() => {
    const determineActiveSection = () => {
      const now = Date.now();

      if (now - lastScrollTime.current < 100) {
        return;
      }

      lastScrollTime.current = now;
      const viewportHeight = window.innerHeight;
      const scrollPosition = window.scrollY;
      const documentHeight = document.body.offsetHeight;
      const threshold = 100;

      const sectionEntries = Object.entries(sectionRefs.current);
      const isNearBottom = (scrollPosition + viewportHeight) / documentHeight > 0.85;

      if (isNearBottom) {
        const visibleSections = sectionEntries
          .filter(([_, el]) => el !== null)
          .map(([id, el]) => {
            const rect = el!.getBoundingClientRect();
            const visibleTop = Math.max(0, rect.top);
            const visibleBottom = Math.min(viewportHeight, rect.bottom);
            const visibleArea = Math.max(0, visibleBottom - visibleTop);

            return { id, visibleArea, bottomPosition: rect.bottom };
          })
          .filter(section => section.visibleArea > 0);

        if (visibleSections.length > 0) {
          const bottomSections = visibleSections.filter(
            section => section.bottomPosition >= viewportHeight * 0.7,
          );

          if (bottomSections.length > 0) {
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

        if (scrollPosition + viewportHeight >= documentHeight - 50 && sections.length > 0) {
          const newActive = sections[sections.length - 1]?.id;

          if (newActive) {
            setActiveSection(newActive);
          }

          return;
        }
      }

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

      if (scrollPosition < 50 && sections.length > 0) {
        const newId = sections.at(0)?.id;

        if (newId) {
          setActiveSection(newId);
        }
      }
    };

    determineActiveSection();
    window.addEventListener('scroll', determineActiveSection, { passive: true });

    return () => window.removeEventListener('scroll', determineActiveSection);
  }, [sections, sectionRefs]);

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    sectionRefs.current[sectionId]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    lastScrollTime.current = Date.now() + 1000;
  };

  useEffect(() => {
    if (onActiveSectionChange) {
      onActiveSectionChange(activeSection);
    }
  }, [activeSection, onActiveSectionChange]);

  const handleSidebarToggle = () => {
    const newState = !isSidebarOpen;
    setIsSidebarOpen(newState);

    if (onSidebarToggle) {
      onSidebarToggle(newState);
    }
  };

  return (
    <nav
      aria-label="Section Observer"
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
          onClick={handleSidebarToggle}
        >
          {isSidebarOpen ? (
            <ArrowRightToLine className="d-5" />
          ) : (
            <ArrowLeftToLine className="d-5" />
          )}
        </Button>
      </div>

      <ul className="space-y-3">
        {sections.map(section =>
          renderSectionItem ? (
            renderSectionItem(section, activeSection === section.id, scrollToSection)
          ) : (
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
          ),
        )}
      </ul>
    </nav>
  );
};
