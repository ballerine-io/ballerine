import { MERCHANT_REPORT_STATUSES_MAP, UPDATEABLE_REPORT_STATUSES } from '@ballerine/common';
import {
  ContentTooltip,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Skeleton,
  TextArea,
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
import { Select } from '@/common/components/atoms/Select/Select';
import { SelectContent } from '@/common/components/atoms/Select/Select.Content';
import { SelectItem } from '@/common/components/atoms/Select/Select.Item';
import { SelectTrigger } from '@/common/components/atoms/Select/Select.Trigger';
import { SelectValue } from '@/common/components/atoms/Select/Select.Value';
import { NotesButton } from '@/common/components/molecules/NotesButton/NotesButton';
import { Form } from '@/common/components/organisms/Form/Form';
import { FormControl } from '@/common/components/organisms/Form/Form.Control';
import { FormField } from '@/common/components/organisms/Form/Form.Field';
import { FormItem } from '@/common/components/organisms/Form/Form.Item';
import { FormLabel } from '@/common/components/organisms/Form/Form.Label';
import { FormMessage } from '@/common/components/organisms/Form/Form.Message';
import { SidebarInset, SidebarProvider } from '@/common/components/organisms/Sidebar/Sidebar';
import { ctw } from '@/common/utils/ctw/ctw';
import { BusinessReport } from '@/domains/business-reports/components/BusinessReport/BusinessReport';
import { Notes } from '@/domains/notes/Notes';
import { MerchantMonitoringReportStatus } from '@/pages/MerchantMonitoring/components/MerchantMonitoringReportStatus/MerchantMonitoringReportStatus';
import { useMerchantMonitoringBusinessReportLogic } from '@/pages/MerchantMonitoringBusinessReport/hooks/useMerchantMonitoringBusinessReportLogic/useMerchantMonitoringBusinessReportLogic';
import { env } from '@/common/env/env';
import { Separator } from '@/common/components/atoms/Separator/Separator';
import { R } from 'msw/lib/glossary-de6278a9';

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

const BusinessReportOptionsDropdown: FunctionComponent<
  Pick<
    ReturnType<typeof useMerchantMonitoringBusinessReportLogic>,
    | 'isDropdownOpen'
    | 'setIsDropdownOpen'
    | 'isDeboardModalOpen'
    | 'setIsDeboardModalOpen'
    | 'isDemoAccount'
    | 'businessReport'
    | 'turnOngoingMonitoringOn'
    | 'form'
    | 'onSubmit'
    | 'deboardingReasonOptions'
  >
> = ({
  isDropdownOpen,
  setIsDropdownOpen,
  isDeboardModalOpen,
  setIsDeboardModalOpen,
  isDemoAccount,
  businessReport,
  turnOngoingMonitoringOn,
  form,
  onSubmit,
  deboardingReasonOptions,
}) => {
  return (
    <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen} modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={
            'ml-auto px-2 py-0 text-xs aria-disabled:pointer-events-none aria-disabled:opacity-50'
          }
        >
          Options
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        onEscapeKeyDown={e => {
          if (isDeboardModalOpen) {
            e.preventDefault();
            setIsDeboardModalOpen(false);
          }
        }}
      >
        <ContentTooltip
          description={
            <p>
              This feature is not available for trial accounts.
              <br />
              Talk to us to get full access
            </p>
          }
          props={{
            tooltipContent: {
              className: ctw({ hidden: !isDemoAccount }),
            },
          }}
        >
          {businessReport?.monitoringStatus === true ? (
            <DialogDropdownItem
              triggerChildren={
                <Button variant={'ghost'} className="justify-start">
                  Turn Monitoring Off
                </Button>
              }
              open={isDeboardModalOpen}
              onOpenChange={setIsDeboardModalOpen}
              disabled={isDemoAccount}
            >
              <DialogHeader>
                <DialogTitle>Confirm Deboarding</DialogTitle>
                <DialogDescription>
                  Are you sure you want to deboard this merchant (turn the monitoring off)?
                </DialogDescription>
              </DialogHeader>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="reason"
                    render={({ field }) => (
                      <FormItem>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormLabel>Reason</FormLabel>

                          <FormControl>
                            <SelectTrigger className="h-9 w-full border-input p-1 shadow-sm">
                              <SelectValue placeholder="Select a reason" />
                            </SelectTrigger>
                          </FormControl>
                          <FormMessage />
                          <SelectContent>
                            {deboardingReasonOptions?.map((option, index) => {
                              return (
                                <SelectItem key={index} value={option}>
                                  {option}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="userReason"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional details</FormLabel>

                        <FormControl>
                          <TextArea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <DialogFooter className="mt-6 flex justify-end space-x-4">
                    <Button
                      type="button"
                      onClick={() => {
                        setIsDeboardModalOpen(false);
                      }}
                      variant="ghost"
                    >
                      Cancel
                    </Button>
                    <Button type="submit" variant="destructive">
                      Turn Off
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogDropdownItem>
          ) : (
            <Button
              onClick={() => {
                if (!businessReport?.business.id) {
                  throw new Error('Business ID is missing');
                }

                turnOngoingMonitoringOn(businessReport.business.id, {
                  onSuccess: () => {
                    setIsDeboardModalOpen(false);
                    setIsDropdownOpen(false);
                  },
                });
              }}
              variant={'ghost'}
              className="justify-start disabled:bg-inherit disabled:text-foreground"
              disabled={isDemoAccount}
            >
              Turn Monitoring On
            </Button>
          )}
        </ContentTooltip>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const MerchantMonitoringBusinessReport: FunctionComponent = () => {
  const {
    onNavigateBack,
    websiteWithNoProtocol,
    businessReport,
    notes,
    isNotesOpen,
    isFetchingBusinessReport,
    locale,
    isDemoAccount,

    // turnOngoingMonitoringOn,
    // isDeboardModalOpen,
    // setIsDeboardModalOpen,
    // isDropdownOpen,
    // setIsDropdownOpen,
    // form,
    // onSubmit,
    // deboardingReasonOptions,
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
    <SidebarProvider
      open={isNotesOpen}
      style={{
        '--sidebar-width': '25rem',
        '--sidebar-width-mobile': '20rem',
      }}
    >
      <SidebarInset>
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
                  <a href={env.VITE_BALLERINE_CALENDLY} target="_blank" rel="noreferrer">
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
                  dayjs(new Date(businessReport?.displayDate)).format('HH:mm MMM Do, YYYY')}
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
              <NotesButton numberOfNotes={notes?.length} />
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
            <BusinessReport report={businessReport} />
          )}
        </section>
      </SidebarInset>
      <Notes
        notes={notes ?? []}
        noteData={{
          entityId: businessReport?.business.id || '',
          entityType: `Business`,
          noteableId: businessReport?.id || '',
          noteableType: `Report`,
        }}
      />
    </SidebarProvider>
  );
};
