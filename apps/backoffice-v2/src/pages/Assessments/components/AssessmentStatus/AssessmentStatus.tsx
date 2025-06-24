import { z } from 'zod';
import { t } from 'i18next';
import { toast } from 'sonner';
import { useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { ASSESSMENT_STATUSES_MAP, UPDATEABLE_ASSESSMENT_STATUSES } from '@ballerine/common';
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
import { KybAndUboChecksStatusButton } from './AssessmentStatusButton';
import { useStatusDialog } from './hooks/useStatusDialog/useStatusDialog';
import { useUpdateAssessmentStatus } from './hooks/useUpdateAssessmentStatus/useUpdateAssessmentStatus';
import { AssessmentStatusBadge, statusToData } from './AssessmentStatusBadge';

const AssessmentCompletedStatusFormSchema = z.object({
  text: z.string().min(1, { message: 'Please provide additional details' }),
});

export const AssessmentStatus = ({
  status,
  assessmentId,
  className,
}: {
  assessmentId?: string;
  className?: string;
  status?: keyof typeof statusToData;
}) => {
  const { mutate: mutateUpdateAssessmentStatus, isLoading: isUpdatingAssessmentStatus } =
    useUpdateAssessmentStatus();

  const formDefaultValues = {
    text: '',
  } satisfies z.infer<typeof AssessmentCompletedStatusFormSchema>;

  const form = useForm({
    resolver: zodResolver(AssessmentCompletedStatusFormSchema),
    defaultValues: formDefaultValues,
  });

  const [isStatusDropdownOpen, toggleStatusDropdownOpen] = useToggle(false);
  const { dialogState, toggleDialogOpenState, closeDialog } = useStatusDialog();

  const onSubmit: SubmitHandler<z.infer<typeof AssessmentCompletedStatusFormSchema>> = async ({
    text,
  }) => {
    if (!dialogState.status) {
      console.error('No status selected');
      toast.error(t(`toast:assessment_status_update.unexpected_error`));

      return;
    }

    mutateUpdateAssessmentStatus(
      { assessmentId, status: dialogState.status },
      {
        onSuccess: () => {
          closeDialog();
          form.reset();
        },
      },
    );
  };

  const disabled = useMemo(
    () =>
      isUpdatingAssessmentStatus ||
      (status &&
        [
          ASSESSMENT_STATUSES_MAP['in-progress'],
          ASSESSMENT_STATUSES_MAP['approved'],
          ASSESSMENT_STATUSES_MAP['rejected'],
        ].includes(status)),
    [isUpdatingAssessmentStatus, status],
  );

  if (!status || !assessmentId) {
    return null;
  }

  return (
    <Dialog open={dialogState.isOpen} onOpenChange={() => toggleDialogOpenState()}>
      <DropdownMenu open={isStatusDropdownOpen} onOpenChange={toggleStatusDropdownOpen}>
        <DropdownMenuTrigger
          disabled={disabled}
          className={ctw(`flex items-center pr-1 focus-visible:outline-none`, className)}
        >
          <AssessmentStatusBadge disabled={disabled} status={status} />
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
          {UPDATEABLE_ASSESSMENT_STATUSES.map(selectableStatus => (
            <DropdownMenuItem
              key={selectableStatus}
              className="flex w-full cursor-pointer items-center p-0"
            >
              <KybAndUboChecksStatusButton
                status={selectableStatus}
                disabled={selectableStatus === status || isUpdatingAssessmentStatus}
                onClick={() => {
                  if (
                    [ASSESSMENT_STATUSES_MAP.approved, ASSESSMENT_STATUSES_MAP.rejected].includes(
                      selectableStatus,
                    )
                  ) {
                    setTimeout(() => {
                      toggleDialogOpenState(selectableStatus);
                    }, 0);

                    return;
                  }

                  mutateUpdateAssessmentStatus({ assessmentId, status: selectableStatus });
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
                  <AssessmentStatusBadge status={dialogState.status} />
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
