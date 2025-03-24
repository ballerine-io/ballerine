import { MERCHANT_REPORT_STATUSES_MAP, UPDATEABLE_REPORT_STATUSES } from '@ballerine/common';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DropdownMenuItem,
  Skeleton,
  TextWithNAFallback,
} from '@ballerine/ui';
import dayjs from 'dayjs';
import { ArrowLeft, ArrowRightIcon, ChevronLeft, FileQuestion } from 'lucide-react';
import React, { forwardRef, FunctionComponent } from 'react';
import { Link } from 'react-router-dom';

import { Button } from '@/common/components/atoms/Button/Button';
import { Card } from '@/common/components/atoms/Card/Card';
import { CardContent } from '@/common/components/atoms/Card/Card.Content';
import { CardFooter } from '@/common/components/atoms/Card/Card.Footer';
import { CardHeader } from '@/common/components/atoms/Card/Card.Header';
import { CardTitle } from '@/common/components/atoms/Card/Card.Title';
import { Separator } from '@/common/components/atoms/Separator/Separator';
import { BALLERINE_CALENDLY_LINK } from '@/common/constants';
import { ctw } from '@/common/utils/ctw/ctw';
import { BusinessReport } from '@/domains/business-reports/components/BusinessReport/BusinessReport';
import { NotesButton } from '@/domains/notes/NotesButton';
import { NotesSheet } from '@/domains/notes/NotesSheet';
import { MerchantMonitoringReportStatus } from '@/pages/MerchantMonitoring/components/MerchantMonitoringReportStatus/MerchantMonitoringReportStatus';
import { useMerchantMonitoringBusinessReportLogic } from '@/pages/MerchantMonitoringBusinessReport/hooks/useMerchantMonitoringBusinessReportLogic/useMerchantMonitoringBusinessReportLogic';
import { BusinessReportOptionsDropdown } from './BusinessReportOptionsDropdown';
import { ReportPDFContainer } from '@/pages/MerchantMonitoringBusinessReport/ReportPDFContainer';

export const DialogDropdownItem = forwardRef<
  React.ElementRef<typeof DropdownMenuItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuItem> & {
    triggerChildren: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
  }
>(({ className, ...props }, ref) => {
  const { triggerChildren, children, open, onOpenChange, ...itemProps } = props;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <DropdownMenuItem
          {...itemProps}
          ref={ref}
          className={className}
          onSelect={event => {
            event.preventDefault();
          }}
        >
          {triggerChildren}
        </DropdownMenuItem>
      </DialogTrigger>

      <DialogContent onPointerDownOutside={e => e.preventDefault()}>{children}</DialogContent>
    </Dialog>
  );
});

DialogDropdownItem.displayName = 'DialogDropdownItem';

export const MerchantMonitoringBusinessReport: FunctionComponent = () => {
  const {
    onNavigateBack,
    websiteWithNoProtocol,
    businessReport,
    notes,
    isNotesOpen,
    setIsNotesOpen,
    isFetchingBusinessReport,
    locale,
    isDemoAccount,
    reportRef,
    reportPDFContainerRef,
    ...dropdownProps
  } = useMerchantMonitoringBusinessReportLogic();

  // User should never really get in here, unless he manually sets the id in the URL.
  // We don't want to prevent backend from sending data for reports that have not been completed yet,
  // so instead we show a fallback UI.
  if (
    !isFetchingBusinessReport &&
    businessReport?.status &&
    !UPDATEABLE_REPORT_STATUSES.includes(businessReport?.status)
  ) {
    let supplementalText = '';

    if (
      [
        MERCHANT_REPORT_STATUSES_MAP['in-progress'],
        MERCHANT_REPORT_STATUSES_MAP['quality-control'],
      ].includes(businessReport.status)
    ) {
      supplementalText = 'It is currently being processed by our system.';
    }

    return (
      <div className="flex h-full items-center justify-center">
        <Card className="mx-auto w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mb-4 flex justify-center">
              <FileQuestion className="h-16 w-16 text-muted-foreground" />
            </div>
            <CardTitle className="text-2xl font-bold">Report Not Ready</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground">
              This report is not available yet. {supplementalText}
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Link to={`/${locale}/merchant-monitoring`}>
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to All Reports
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <section className="flex h-full flex-col px-6 pt-4">
      <div className={`flex justify-between pb-4`}>
        <Button
          variant={'ghost'}
          onClick={onNavigateBack}
          className={'flex items-center space-x-px pe-3 ps-1 font-semibold'}
        >
          <ChevronLeft size={18} /> <span>View All Reports</span>
        </Button>

        {isDemoAccount ? (
          <div className="space-x-6 text-sm">
            <span>Get a guided walkthrough of the report</span>
            <Button asChild variant="wp-primary" className="justify-start space-x-2" size="sm">
              <a href={BALLERINE_CALENDLY_LINK} target="_blank" rel="noreferrer">
                <span>Book a quick call</span>
                <ArrowRightIcon className="d-4" />
              </a>
            </Button>
          </div>
        ) : (
          <BusinessReportOptionsDropdown
            {...dropdownProps}
            businessReport={businessReport}
            isDemoAccount={isDemoAccount}
          />
        )}
      </div>

      {/* This ignores parent's padding and covers the whole width. Since we know that padding-x is 6 (1.5rem * 2),
          we can easily determine negative margin and width required to properly display the separator. */}
      <Separator className="-ml-6 mb-4 w-[calc(100%+3rem)]" />

      {isFetchingBusinessReport ? (
        <Skeleton className="h-6 w-32" />
      ) : (
        <div className="flex items-center justify-between">
          <TextWithNAFallback as={'h2'} className="pb-4 text-2xl font-bold">
            {websiteWithNoProtocol}
          </TextWithNAFallback>

          {isDemoAccount && (
            <BusinessReportOptionsDropdown
              {...dropdownProps}
              businessReport={businessReport}
              isDemoAccount={isDemoAccount}
            />
          )}
        </div>
      )}
      {isFetchingBusinessReport ? (
        <Skeleton className="my-6 h-6 w-2/3" />
      ) : (
        <div className={`flex items-center space-x-8 pb-4`}>
          <div className={`flex items-center`}>
            <span className={`me-4 text-sm leading-6 text-slate-400`}>Status</span>
            <MerchantMonitoringReportStatus
              reportId={businessReport?.id}
              status={businessReport?.status}
              businessId={businessReport?.business.id}
            />
          </div>
          <div className={`text-sm`}>
            <span className={`me-2 leading-6 text-slate-400`}>Created at</span>
            {businessReport?.displayDate &&
              dayjs(new Date(businessReport?.displayDate)).format('MMM Do, YYYY HH:mm')}
          </div>
          <div className={`flex items-center space-x-2 text-sm`}>
            <span className={`text-slate-400`}>Monitoring Status</span>
            <span
              className={ctw('select-none rounded-full d-3', {
                'bg-success': businessReport?.monitoringStatus,
                'bg-slate-400': !businessReport?.monitoringStatus,
              })}
            >
              &nbsp;
            </span>
          </div>
          <NotesSheet
            open={isNotesOpen}
            onOpenChange={setIsNotesOpen}
            modal={false}
            notes={notes ?? []}
            noteData={{
              entityId: businessReport?.business.id || '',
              entityType: `Business`,
              noteableId: businessReport?.id || '',
              noteableType: `Report`,
            }}
          >
            <NotesButton numberOfNotes={notes?.length} />
          </NotesSheet>
        </div>
      )}
      {isFetchingBusinessReport || !businessReport ? (
        <>
          <Skeleton className="h-6 w-72" />
          <Skeleton className="mt-6 h-4 w-40" />

          <div className="mt-6 flex h-[24rem] w-full flex-nowrap gap-8">
            <Skeleton className="w-2/3" />
            <Skeleton className="w-1/3" />
          </div>
          <Skeleton className="mt-6 h-[16rem]" />
        </>
      ) : (
        <BusinessReport report={businessReport} ref={reportRef} />
      )}

      <ReportPDFContainer
        ref={reportPDFContainerRef}
        businessReport={businessReport}
        websiteWithNoProtocol={websiteWithNoProtocol}
      />
    </section>
  );
};
