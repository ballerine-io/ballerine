import React, { FunctionComponent } from 'react';
import { FileText, Loader2, Power } from 'lucide-react';
import {
  ContentTooltip,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  TextArea,
} from '@ballerine/ui';

import { ctw } from '@/common/utils/ctw/ctw';
import { Form } from '@/common/components/organisms/Form/Form';
import { Button } from '@/common/components/atoms/Button/Button';
import { Select } from '@/common/components/atoms/Select/Select';
import { FormItem } from '@/common/components/organisms/Form/Form.Item';
import { FormField } from '@/common/components/organisms/Form/Form.Field';
import { FormLabel } from '@/common/components/organisms/Form/Form.Label';
import { SelectItem } from '@/common/components/atoms/Select/Select.Item';
import { SelectValue } from '@/common/components/atoms/Select/Select.Value';
import { FormControl } from '@/common/components/organisms/Form/Form.Control';
import { FormMessage } from '@/common/components/organisms/Form/Form.Message';
import { SelectContent } from '@/common/components/atoms/Select/Select.Content';
import { SelectTrigger } from '@/common/components/atoms/Select/Select.Trigger';
import { DialogDropdownItem } from '@/pages/MerchantMonitoringBusinessReport/MerchantMonitoringBusinessReport.page';
import { useMerchantMonitoringBusinessReportLogic } from '@/pages/MerchantMonitoringBusinessReport/hooks/useMerchantMonitoringBusinessReportLogic/useMerchantMonitoringBusinessReportLogic';

export const BusinessReportOptionsDropdown: FunctionComponent<
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
    | 'generatePDF'
    | 'isGeneratingPDF'
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
  generatePDF,
  isGeneratingPDF,
}) => {
  return (
    <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen} modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={ctw(
            'ml-auto px-2 py-0 text-xs aria-disabled:pointer-events-none aria-disabled:opacity-50',
            { 'pointer-events-none': isGeneratingPDF },
          )}
        >
          {isGeneratingPDF ? <Loader2 className="animate-spin d-4" /> : 'Options'}
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
            tooltipTrigger: {
              className: 'w-full',
            },
            tooltipContent: {
              className: ctw({ hidden: !isDemoAccount }),
            },
          }}
        >
          <DropdownMenuItem
            disabled={isDemoAccount}
            className={'w-full p-0 data-[disabled]:!opacity-100'}
            onClick={async () => {
              await generatePDF();
              setIsDropdownOpen(false);
            }}
          >
            <Button
              disabled={isDemoAccount}
              variant={'ghost'}
              className="flex w-full items-center justify-start gap-x-2"
            >
              <FileText className={'d-4'} />
              Export PDF
            </Button>
          </DropdownMenuItem>
        </ContentTooltip>
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
                <Button variant={'ghost'} className="flex items-center justify-start gap-x-2">
                  <Power className={'d-4'} />
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
              className="flex w-full items-center justify-start gap-x-2 disabled:bg-inherit disabled:text-foreground"
              disabled={isDemoAccount}
            >
              <Power className={'d-4'} />
              Turn Monitoring On
            </Button>
          )}
        </ContentTooltip>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
