import { z } from 'zod';
import React, { ComponentProps } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { MERCHANT_REPORT_STATUSES_MAP } from '@ballerine/common';
import {
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

import { Form } from '@/common/components/organisms/Form/Form';
import { Button } from '@/common/components/atoms/Button/Button';
import { FormItem } from '@/common/components/organisms/Form/Form.Item';
import { FormField } from '@/common/components/organisms/Form/Form.Field';
import { FormLabel } from '@/common/components/organisms/Form/Form.Label';
import { FormControl } from '@/common/components/organisms/Form/Form.Control';
import { FormMessage } from '@/common/components/organisms/Form/Form.Message';
import { useUpdateReportStatusMutation } from '@/pages/MerchantMonitoring/components/MerchantMonitoringReportStatus/hooks/useUpdateReportStatusMutation/useUpdateReportStatusMutation';
import {
  MerchantMonitoringStatusBadge,
  statusToData,
} from '@/pages/MerchantMonitoring/components/MerchantMonitoringReportStatus/MerchantMonitoringStatusBadge';
import { useToggle } from '@/common/hooks/useToggle/useToggle';
import { useCreateNoteMutation } from '@/domains/notes/hooks/mutations/useCreateNoteMutation/useCreateNoteMutation';
import { DialogDropdownItem } from '@/pages/MerchantMonitoringBusinessReport/MerchantMonitoringBusinessReport.page';
import { MerchantMonitoringStatusButton } from './MerchantMonitoringReportStatusButton';

const selectableStatuses = [
  MERCHANT_REPORT_STATUSES_MAP['pending-review'],
  MERCHANT_REPORT_STATUSES_MAP['under-review'],
  MERCHANT_REPORT_STATUSES_MAP.completed,
];

const MerchantMonitoringCompletedStatusFormSchema = z.object({
  text: z.string().optional(),
});

export const MerchantMonitoringReportStatus = ({
  status,
  reportId,
  businessId,
  onClick,
}: {
  reportId?: string;
  businessId?: string;
  status?: keyof typeof statusToData;
  onClick?: ComponentProps<typeof Button>['onClick'];
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

  const [isCompleteReviewModalOpen, setIsCompleteReviewModalOpen] = useToggle(false);

  const onSubmit: SubmitHandler<
    z.infer<typeof MerchantMonitoringCompletedStatusFormSchema>
  > = async ({ text }) => {
    mutateUpdateReportStatus({ reportId, status: MERCHANT_REPORT_STATUSES_MAP.completed, text });

    const content = `Status changed to 'Review Completed' ${text ? ` with details: ${text}` : ''}`;

    void mutateCreateNote({
      content,
      entityId: businessId ?? '',
      entityType: 'Business',
      noteableId: reportId ?? '',
      noteableType: 'Report',
      parentNoteId: null,
    });

    setIsCompleteReviewModalOpen(false);
    form.reset();
  };

  if (!status || !reportId) {
    return null;
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          className={`flex items-center focus-visible:outline-none`}
          disabled={
            isLoading ||
            [
              MERCHANT_REPORT_STATUSES_MAP['in-progress'],
              MERCHANT_REPORT_STATUSES_MAP['quality-control'],
              MERCHANT_REPORT_STATUSES_MAP['completed'],
            ].includes(status)
          }
        >
          <MerchantMonitoringStatusBadge disabled={isLoading} status={status} />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className={`space-y-2 p-4`}
          onEscapeKeyDown={e => {
            if (isCompleteReviewModalOpen) {
              e.preventDefault();
            }

            setIsCompleteReviewModalOpen(false);
          }}
        >
          {selectableStatuses.map(selectableStatus =>
            selectableStatus === MERCHANT_REPORT_STATUSES_MAP.completed ? (
              <DialogDropdownItem
                key={selectableStatus}
                className="flex w-full cursor-pointer items-center p-0"
                triggerChildren={
                  <MerchantMonitoringStatusButton disabled={isLoading} status={selectableStatus} />
                }
                open={isCompleteReviewModalOpen}
                onOpenChange={() => {
                  const activeElement = document.activeElement as HTMLElement;

                  if (activeElement) {
                    activeElement.blur();
                  }

                  setIsCompleteReviewModalOpen();
                }}
              >
                <DialogHeader>
                  <DialogTitle>Confirm Review Completion</DialogTitle>
                  <DialogDescription>
                    Please provide any relevant details or findings regarding the review. This can
                    include notes or conclusions drawn from the investigation.
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
                          setIsCompleteReviewModalOpen(false);
                        }}
                        variant="ghost"
                      >
                        Cancel
                      </Button>
                      <Button type="submit" variant="destructive">
                        Complete Review
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogDropdownItem>
            ) : (
              <DropdownMenuItem
                key={selectableStatus}
                className="flex w-full cursor-pointer items-center p-0"
              >
                <MerchantMonitoringStatusButton
                  status={selectableStatus}
                  disabled={selectableStatus === status || isLoading}
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();

                    mutateUpdateReportStatus({ reportId, status: selectableStatus });
                  }}
                />
              </DropdownMenuItem>
            ),
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
