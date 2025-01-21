import {
  Badge,
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
  TextArea,
  Skeleton,
  TextWithNAFallback,
} from '@ballerine/ui';
import dayjs from 'dayjs';
import { ChevronLeft } from 'lucide-react';
import React, { forwardRef, FunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import { titleCase } from 'string-ts';

import { Button } from '@/common/components/atoms/Button/Button';
import { Select } from '@/common/components/atoms/Select/Select';
import { SelectContent } from '@/common/components/atoms/Select/Select.Content';
import { SelectItem } from '@/common/components/atoms/Select/Select.Item';
import { SelectTrigger } from '@/common/components/atoms/Select/Select.Trigger';
import { SelectValue } from '@/common/components/atoms/Select/Select.Value';
import { NotesButton } from '@/common/components/molecules/NotesButton/NotesButton';
import { ScrollArea } from '@/common/components/molecules/ScrollArea/ScrollArea';
import { Form } from '@/common/components/organisms/Form/Form';
import { FormControl } from '@/common/components/organisms/Form/Form.Control';
import { FormField } from '@/common/components/organisms/Form/Form.Field';
import { FormItem } from '@/common/components/organisms/Form/Form.Item';
import { FormLabel } from '@/common/components/organisms/Form/Form.Label';
import { FormMessage } from '@/common/components/organisms/Form/Form.Message';
import { SidebarInset, SidebarProvider } from '@/common/components/organisms/Sidebar/Sidebar';
import { Tabs } from '@/common/components/organisms/Tabs/Tabs';
import { TabsContent } from '@/common/components/organisms/Tabs/Tabs.Content';
import { TabsList } from '@/common/components/organisms/Tabs/Tabs.List';
import { TabsTrigger } from '@/common/components/organisms/Tabs/Tabs.Trigger';
import { ctw } from '@/common/utils/ctw/ctw';
import { MERCHANT_REPORT_STATUSES_MAP } from '@/domains/business-reports/constants';
import { Notes } from '@/domains/notes/Notes';
import { useMerchantMonitoringBusinessReportLogic } from '@/pages/MerchantMonitoringBusinessReport/hooks/useMerchantMonitoringBusinessReportLogic/useMerchantMonitoringBusinessReportLogic';

const DialogDropdownItem = forwardRef<
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
    statusToBadgeData,
    tabs,
    activeTab,
    notes,
    isNotesOpen,
    turnOngoingMonitoringOn,
    isDeboardModalOpen,
    setIsDeboardModalOpen,
    isDropdownOpen,
    setIsDropdownOpen,
    form,
    onSubmit,
    deboardingReasonOptions,
    isFetchingBusinessReport,
  } = useMerchantMonitoringBusinessReportLogic();

  return (
    <SidebarProvider
      open={isNotesOpen}
      style={{
        '--sidebar-width': '25rem',
        '--sidebar-width-mobile': '20rem',
      }}
    >
      <SidebarInset>
        <section className="flex h-full flex-col px-6 pb-6 pt-4">
          <div className={`flex justify-between`}>
            <Button
              variant={'ghost'}
              onClick={onNavigateBack}
              className={'mb-6 flex items-center space-x-px pe-3 ps-1 font-semibold'}
            >
              <ChevronLeft size={18} /> <span>Back</span>
            </Button>
            <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen} modal={false}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className={
                    'px-2 py-0 text-xs aria-disabled:pointer-events-none aria-disabled:opacity-50'
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
                  }

                  setIsDeboardModalOpen(false);
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
                      if (!businessReport?.merchantId) {
                        throw new Error('Merchant ID is missing');
                      }

                      turnOngoingMonitoringOn(businessReport.merchantId, {
                        onSuccess: () => {
                          setIsDeboardModalOpen(false);
                          setIsDropdownOpen(false);
                        },
                      });
                    }}
                    variant={'ghost'}
                    className="justify-start"
                  >
                    Turn Monitoring On
                  </Button>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {isFetchingBusinessReport ? (
            <Skeleton className="h-6 w-32" />
          ) : (
            <TextWithNAFallback as={'h2'} className="pb-4 text-2xl font-bold">
              {websiteWithNoProtocol}
            </TextWithNAFallback>
          )}
          {isFetchingBusinessReport ? (
            <Skeleton className="my-6 h-6 w-2/3" />
          ) : (
            <div className={`flex items-center space-x-8 pb-4`}>
              <div className={`flex items-center`}>
                <span className={`me-4 text-sm leading-6 text-slate-400`}>Status</span>
                <Badge
                  variant={
                    statusToBadgeData[businessReport?.status as keyof typeof statusToBadgeData]
                      ?.variant
                  }
                  className={ctw(`text-sm font-bold`, {
                    'bg-info/20 text-info':
                      businessReport?.status === MERCHANT_REPORT_STATUSES_MAP.completed,
                    'bg-violet-500/20 text-violet-500': [
                      MERCHANT_REPORT_STATUSES_MAP['in-progress'],
                      MERCHANT_REPORT_STATUSES_MAP['quality-control'],
                    ].includes(businessReport?.status ?? ''),
                  })}
                >
                  {statusToBadgeData[businessReport?.status as keyof typeof statusToBadgeData]
                    ?.text ?? titleCase(businessReport?.status ?? '')}
                </Badge>
              </div>
              <div className={`text-sm`}>
                <span className={`me-2 leading-6 text-slate-400`}>Created at</span>
                {businessReport?.createdAt &&
                  dayjs(new Date(businessReport?.createdAt)).format('HH:mm MMM Do, YYYY')}
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
          <Tabs defaultValue={activeTab} className="w-full" key={activeTab}>
            <TabsList className={'mb-4'}>
              {tabs.map(tab => (
                <TabsTrigger key={tab.value} value={tab.value} asChild>
                  <Link
                    to={{
                      search: `?activeTab=${tab.value}`,
                    }}
                  >
                    {tab.label}
                  </Link>
                </TabsTrigger>
              ))}
            </TabsList>
            <ScrollArea orientation={'vertical'} className={'h-[65vh] 2xl:h-[75vh]'}>
              {isFetchingBusinessReport ? (
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
                tabs.map(tab => (
                  <TabsContent key={tab.value} value={tab.value}>
                    {tab.content}
                  </TabsContent>
                ))
              )}
            </ScrollArea>
          </Tabs>
        </section>
      </SidebarInset>
      <Notes
        notes={notes ?? []}
        noteData={{
          entityId: businessReport?.merchantId || '',
          entityType: `Business`,
          noteableId: businessReport?.id || '',
          noteableType: `Report`,
        }}
      />
    </SidebarProvider>
  );
};
