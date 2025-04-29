import { z } from 'zod';
import { useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import {
  isObject,
  MERCHANT_REPORT_STATUSES_MAP,
  UPDATEABLE_REPORT_STATUSES as _UPDATEABLE_REPORT_STATUSES,
} from '@ballerine/common';
import {
  ctw,
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
import { useMerchantMonitoringStatusDialog } from './hooks/useMerchantMonitoringStatusDialog/useMerchantMonitoringStatusDialog';
import { toast } from 'sonner';
import { t } from 'i18next';
import { getNoteContentForUnsubscribe } from './helpers/get-note-content-for-unsubscribe';
import { getBaseNoteContent } from './helpers/get-base-note-content';
import { useToggleMonitoringMutation } from '@/pages/MerchantMonitoringBusinessReport/hooks/useToggleMonitoringMutation/useToggleMonitoringMutation';

/* TODO: Remove this filtering once completed status is removed */
const UPDATEABLE_REPORT_STATUSES = _UPDATEABLE_REPORT_STATUSES.filter(
  status => status !== 'completed',
);

const MerchantMonitoringCompletedStatusFormSchema = z.object({
  text: z.string().min(1, { message: 'Please provide additional details' }),
});

export const MerchantMonitoringReportStatus = ({
  status,
  reportId,
  className,
  businessId,
}: {
  reportId?: string;
  className?: string;
  businessId?: string;
  status?: keyof typeof statusToData;
}) => {
  const { mutateAsync: mutateCreateNote } = useCreateNoteMutation({ disableToast: true });

  const { mutate: mutateUpdateReportStatus, isLoading: isUpdatingReportStatus } =
    useUpdateReportStatusMutation();
  const { mutateAsync: turnOffMonitoringMutation, isLoading: isTurningOffMonitoring } =
    useToggleMonitoringMutation({
      state: 'off',
      onSuccess: () => {
        form.reset();
        toast.success(t(`toast:business_monitoring_off.success`));
      },
      onError: error => {
        toast.error(
          t(`toast:business_monitoring_off.error`, {
            errorMessage: isObject(error) && 'message' in error ? error.message : error,
          }),
        );
      },
    });

  const isUpdatingReport = useMemo(
    () => isUpdatingReportStatus || isTurningOffMonitoring,
    [isUpdatingReportStatus, isTurningOffMonitoring],
  );

  const formDefaultValues = {
    text: '',
  } satisfies z.infer<typeof MerchantMonitoringCompletedStatusFormSchema>;

  const form = useForm({
    resolver: zodResolver(MerchantMonitoringCompletedStatusFormSchema),
    defaultValues: formDefaultValues,
  });

  const [isStatusDropdownOpen, toggleStatusDropdownOpen] = useToggle(false);
  const { dialogState, toggleDialogOpenState, closeDialog } = useMerchantMonitoringStatusDialog();

  const onSubmit: SubmitHandler<
    z.infer<typeof MerchantMonitoringCompletedStatusFormSchema>
  > = async ({ text }) => {
    if (!dialogState.status) {
      console.error('No status selected');
      toast.error(t(`toast:business_report_status_update.unexpected_error`));

      return;
    }

    const isShouldUnsubscribe = dialogState.status === MERCHANT_REPORT_STATUSES_MAP['terminated'];

    const statusReadableText = statusToData[dialogState.status as keyof typeof statusToData]?.title;
    const noteContent = isShouldUnsubscribe
      ? getNoteContentForUnsubscribe(statusReadableText, text)
      : getBaseNoteContent(statusReadableText, text);

    if (isShouldUnsubscribe) {
      await turnOffMonitoringMutation(businessId ?? '');
    }

    mutateUpdateReportStatus({ reportId, status: dialogState.status, text });

    void mutateCreateNote({
      content: noteContent,
      entityId: businessId ?? '',
      entityType: 'Business',
      noteableId: reportId ?? '',
      noteableType: 'Report',
      parentNoteId: null,
    });

    closeDialog();
    form.reset();
  };

  const disabled = useMemo(
    () =>
      isUpdatingReport ||
      (status &&
        [
          MERCHANT_REPORT_STATUSES_MAP['in-progress'],
          MERCHANT_REPORT_STATUSES_MAP['quality-control'],
          MERCHANT_REPORT_STATUSES_MAP['completed'],
          MERCHANT_REPORT_STATUSES_MAP['cleared'],
          MERCHANT_REPORT_STATUSES_MAP['conditionally-approved'],
          MERCHANT_REPORT_STATUSES_MAP['terminated'],
        ].includes(status)),
    [isUpdatingReport, status],
  );

  if (!status || !reportId) {
    return null;
  }

  return (
    <Dialog open={dialogState.isOpen} onOpenChange={() => toggleDialogOpenState()}>
      <DropdownMenu open={isStatusDropdownOpen} onOpenChange={toggleStatusDropdownOpen}>
        <DropdownMenuTrigger
          disabled={disabled}
          className={ctw(`flex items-center pr-1 focus-visible:outline-none`, className)}
        >
          <MerchantMonitoringStatusBadge disabled={disabled} status={status} />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className={`mr-6 space-y-2 p-4`}
          onEscapeKeyDown={e => {
            if (dialogState.isOpen) {
              e.stopPropagation();
              e.preventDefault();
            }

            closeDialog();
          }}
        >
          {UPDATEABLE_REPORT_STATUSES.map(selectableStatus => (
            <DropdownMenuItem
              key={selectableStatus}
              className="flex w-full cursor-pointer items-center p-0"
            >
              <MerchantMonitoringStatusButton
                status={selectableStatus}
                disabled={selectableStatus === status || isUpdatingReport}
                onClick={() => {
                  if (
                    [
                      MERCHANT_REPORT_STATUSES_MAP.cleared,
                      MERCHANT_REPORT_STATUSES_MAP['conditionally-approved'],
                      MERCHANT_REPORT_STATUSES_MAP.terminated,
                    ].includes(selectableStatus)
                  ) {
                    setTimeout(() => {
                      toggleDialogOpenState(selectableStatus);
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
            {dialogState.status && (
              <div className="flex flex-col gap-2">
                <span className="text-sm">Resolution Status</span>
                <div>
                  <MerchantMonitoringStatusBadge status={dialogState.status} />
                </div>
              </div>
            )}
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
              <Button type="button" onClick={closeDialog} variant="ghost">
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
