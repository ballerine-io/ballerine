import dayjs from 'dayjs';
import { useRef } from 'react';
import { X, AlertTriangle, Info, ChevronLeft } from 'lucide-react';

import { Button, ContentTooltip, Skeleton, TextWithNAFallback } from '@ballerine/ui';
import { Separator } from '@/common/components/atoms/Separator/Separator';
import { SectionObserver } from '@/common/components/organisms/SectionObserver/SectionObserver';
import { useKybAndOwnershipAssessmentPageLogic } from './hooks/useKybAndOwnershipAssessmentPageLogic';
import { NotesSheet } from '@/domains/notes/NotesSheet';
import { NotesButton } from '@/domains/notes/NotesButton';
import { MerchantMonitoringReportStatus } from '../MerchantMonitoring/components/MerchantMonitoringReportStatus/MerchantMonitoringReportStatus';
import { WarningFlag } from './hooks/useAssessmentChecks';
import { ctw } from '@/common/utils/ctw/ctw';

type WarningBannerProps = {
  warningFlags: WarningFlag[];
};

const WarningBanner = ({ warningFlags }: WarningBannerProps) => {
  if (!warningFlags.length) return null;

  return (
    <div className="mb-6 space-y-2">
      {warningFlags.map(flag => (
        <div
          key={flag.title}
          className={ctw('flex items-center gap-3 rounded-md border p-2.5', {
            'border-red-200 bg-red-100': flag.severity === 'error',
            'border-warning bg-warning': flag.severity === 'warning',
            'border-gray-200 bg-gray-100': flag.severity === 'info',
          })}
        >
          <div
            className={ctw(
              'flex h-4 w-4 items-center justify-center rounded-full text-xs text-white',
              {
                'bg-red-600': flag.severity === 'error',
                'bg-warning': flag.severity === 'warning',
                'bg-gray-400': flag.severity === 'info',
              },
            )}
          >
            {flag.severity === 'info' ? '?' : 'X'}
          </div>
          <span className="text-sm text-gray-700">{flag.title}</span>
        </div>
      ))}
    </div>
  );
};

export const KybAndOwnershipAssessmentPage = () => {
  const {
    sections,
    assessment,
    isLoadingAssessment,
    assessmentId,
    onNavigateBack,
    notes,
    isNotesOpen,
    setIsNotesOpen,
    warningFlags,
  } = useKybAndOwnershipAssessmentPageLogic();

  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  if (isLoadingAssessment || !assessment) {
    return (
      <>
        <Skeleton className="h-6 w-72" />
        <Skeleton className="mt-6 h-4 w-40" />

        <div className="mt-6 flex h-[24rem] w-full flex-nowrap gap-8">
          <Skeleton className="w-2/3" />
          <Skeleton className="w-1/3" />
        </div>
        <Skeleton className="mt-6 h-[16rem]" />
      </>
    );
  }

  return (
    <div>
      <div className="px-6 pt-4">
        <Button
          variant={'ghost'}
          onClick={onNavigateBack}
          className={'flex items-center space-x-px pe-3 ps-1 font-semibold'}
        >
          <ChevronLeft size={18} /> <span>View All Checks</span>
        </Button>
      </div>

      <Separator className="my-4" />

      <div className="flex">
        <div className="flex-1 overflow-y-auto">
          <div className="flex-col px-6 pt-4">
            <TextWithNAFallback as={'h2'} className="pb-4 text-2xl font-bold">
              {assessment.input?.companyName}
            </TextWithNAFallback>

            <div className={`flex items-center space-x-8 pb-4`}>
              <div className={`flex items-center`}>
                <span className={`me-4 text-sm leading-6 text-slate-400`}>Status</span>
                <MerchantMonitoringReportStatus
                  reportId={assessmentId}
                  status={assessment.status}
                  businessId={assessment.input?.businessId ?? ''}
                />
              </div>

              <div className={`text-sm`}>
                <span className={`me-2 leading-6 text-slate-400`}>Created at</span>
                {assessment.createdAt &&
                  dayjs(new Date(assessment.createdAt)).format('MMM Do, YYYY HH:mm')}
              </div>

              <NotesSheet
                open={isNotesOpen}
                onOpenChange={setIsNotesOpen}
                modal={false}
                notes={notes ?? []}
                noteData={{
                  entityId: assessment.input?.businessId || '',
                  entityType: `Business`,
                  noteableId: assessment.id || '',
                  noteableType: `Report`,
                }}
              >
                <NotesButton numberOfNotes={notes?.length} />
              </NotesSheet>
            </div>

            {warningFlags && warningFlags.length > 0 && (
              <WarningBanner warningFlags={warningFlags} />
            )}

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
                    <ContentTooltip description={section.description}>
                      {titleContent}
                    </ContentTooltip>
                  ) : (
                    <>{titleContent}</>
                  )}

                  {section.Component}
                </div>
              );
            })}
          </div>
        </div>
        <SectionObserver sections={sections} sectionRefs={sectionRefs} />
      </div>
    </div>
  );
};
