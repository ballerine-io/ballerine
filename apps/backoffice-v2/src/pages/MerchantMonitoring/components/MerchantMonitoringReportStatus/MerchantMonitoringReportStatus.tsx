import { z } from 'zod';
import React, { useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { MERCHANT_REPORT_STATUSES_MAP, UPDATEABLE_REPORT_STATUSES } from '@ballerine/common';
import {
  Dialog,
  DialogContent,
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

import { useToggle } from '@/common/hooks/useToggle/useToggle';
import { Form } from '@/common/components/organisms/Form/Form';
import { Button } from '@/common/components/atoms/Button/Button';
import { FormItem } from '@/common/components/organisms/Form/Form.Item';
import { FormField } from '@/common/components/organisms/Form/Form.Field';
import { FormLabel } from '@/common/components/organisms/Form/Form.Label';
import { FormControl } from '@/common/components/organisms/Form/Form.Control';
import { FormMessage } from '@/common/components/organisms/Form/Form.Message';
import { MerchantMonitoringStatusButton } from './MerchantMonitoringReportStatusButton';
import { useCreateNoteMutation } from '@/domains/notes/hooks/mutations/useCreateNoteMutation/useCreateNoteMutation';
import { useUpdateReportStatusMutation } from '@/pages/MerchantMonitoring/components/MerchantMonitoringReportStatus/hooks/useUpdateReportStatusMutation/useUpdateReportStatusMutation';
import {
  MerchantMonitoringStatusBadge,
  statusToData,
} from '@/pages/MerchantMonitoring/components/MerchantMonitoringReportStatus/MerchantMonitoringStatusBadge';

const MerchantMonitoringCompletedStatusFormSchema = z.object({
  text: z.string().optional(),
});

export const MerchantMonitoringReportStatus = ({
  status,
  reportId,
  businessId,
}: {
  reportId?: string;
  businessId?: string;
  status?: keyof typeof statusToData;
}) => {
  const { mutateAsync: mutateCreateNote } = useCreateNoteMutation({ disableToast: true });

  const { mutate: mutateUpdateReportStatus, isLoading } = useUpdateReportStatusMutation();

  const formDefaultValues = {
    text: '',
  } satisfies z.infer<typeof MerchantMonitoringCompletedStatusFormSchema>;

  const form = useForm({
    resolver: zodResolver(MerchantMonitoringCompletedStatusFormSchema),
    defaultValues: formDefaultValues,
  });

  const [isStatusDropdownOpen, toggleStatusDropdownOpen] = useToggle(false);
  const [isCompleteReviewModalOpen, toggleCompleteReviewModalOpen, _, closeCompleteReviewModal] =
    useToggle(false);

  const onSubmit: SubmitHandler<
    z.infer<typeof MerchantMonitoringCompletedStatusFormSchema>
  > = async ({ text }) => {
    mutateUpdateReportStatus({ reportId, status: MERCHANT_REPORT_STATUSES_MAP.completed, text });

    const content = `
      <div class="flex flex-col">
        <span class="text-xs leading-6 text-slate-500">Status changed to <span class="font-semibold">'Review Completed'</span>
        ${text ? ` with details:</span><div class="text-sm">${text}</div>` : '</span>'}
      </div>
    `;

    void mutateCreateNote({
      content,
      entityId: businessId ?? '',
      entityType: 'Business',
      noteableId: reportId ?? '',
      noteableType: 'Report',
      parentNoteId: null,
    });

    closeCompleteReviewModal();
    form.reset();
  };

  const disabled = useMemo(
    () =>
      isLoading ||
      (status &&
        [
          MERCHANT_REPORT_STATUSES_MAP['in-progress'],
          MERCHANT_REPORT_STATUSES_MAP['quality-control'],
          MERCHANT_REPORT_STATUSES_MAP['completed'],
        ].includes(status)),
    [isLoading, status],
  );

  if (!status || !reportId) {
    return null;
  }

  return (
    <Dialog open={isCompleteReviewModalOpen} onOpenChange={toggleCompleteReviewModalOpen}>
      <DropdownMenu open={isStatusDropdownOpen} onOpenChange={toggleStatusDropdownOpen}>
        <DropdownMenuTrigger
          disabled={disabled}
          className={`flex items-center focus-visible:outline-none`}
        >
          <MerchantMonitoringStatusBadge disabled={disabled} status={status} />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className={`space-y-2 p-4`}
          onEscapeKeyDown={e => {
            if (isCompleteReviewModalOpen) {
              e.stopPropagation();
              e.preventDefault();
            }

            closeCompleteReviewModal();
          }}
        >
          {UPDATEABLE_REPORT_STATUSES.map(selectableStatus => (
            <DropdownMenuItem
              key={selectableStatus}
              className="flex w-full cursor-pointer items-center p-0"
            >
              <MerchantMonitoringStatusButton
                status={selectableStatus}
                disabled={selectableStatus === status || isLoading}
                onClick={() => {
                  if (selectableStatus === MERCHANT_REPORT_STATUSES_MAP.completed) {
                    setTimeout(() => {
                      toggleCompleteReviewModalOpen();
                    }, 0);

                    return;
                  }

                  mutateUpdateReportStatus({ reportId, status: selectableStatus });
                  toggleStatusDropdownOpen();
                }}
              />
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent
        onCloseAutoFocus={event => {
          event.preventDefault();
          document.body.style.pointerEvents = '';
        }}
      >
        <DialogHeader>
          <DialogTitle>Confirm Review Completion</DialogTitle>
          <DialogDescription>
            Please provide any relevant details or findings regarding the review. This can include
            notes or conclusions drawn from the investigation.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              name="text"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional details</FormLabel>

                  <FormControl>
                    <TextArea
                      {...field}
                      placeholder="Add additional details that will be saved in the report's notes section"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-6 flex justify-end space-x-4">
              <Button type="button" onClick={closeCompleteReviewModal} variant="ghost">
                Cancel
              </Button>
              <Button type="submit">Complete Review</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
