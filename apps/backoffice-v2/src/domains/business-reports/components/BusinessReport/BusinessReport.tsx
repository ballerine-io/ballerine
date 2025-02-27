import { z } from 'zod';
import { useRef, useState } from 'react';
import { ReportSchema } from '@ballerine/common';
import { ContentTooltip, useReportSections } from '@ballerine/ui';

import { BusinessReportSectionsObserver } from './BusinessReportSectionsObserver';

type BusinessReportProps = {
  report: z.infer<typeof ReportSchema>;
};

export const BusinessReport = ({ report }: BusinessReportProps) => {
  const { sections } = useReportSections(report);
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const parentRef = useRef<HTMLDivElement | null>(null);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div ref={parentRef} className={`flex transition-all duration-300`}>
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

      <BusinessReportSectionsObserver
        sections={sections}
        sectionRefs={sectionRefs}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
    </div>
  );
};
