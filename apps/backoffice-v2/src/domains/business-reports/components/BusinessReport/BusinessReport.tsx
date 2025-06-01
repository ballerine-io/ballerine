import { forwardRef, useRef } from 'react';
import { z } from 'zod';

import { ReportSchema } from '@ballerine/common';
import { ContentTooltip, useReportSections } from '@ballerine/ui';

import { SectionObserver } from '@/common/components/organisms/SectionObserver/SectionObserver';

type BusinessReportProps = {
  report: z.infer<typeof ReportSchema>;
  disableSectionObserver?: boolean;
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
          <SectionObserver sections={sections} sectionRefs={sectionRefs} />
        )}
      </div>
    );
  },
);

BusinessReport.displayName = 'BusinessReport';
