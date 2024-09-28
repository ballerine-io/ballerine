import React, { ComponentProps, FunctionComponent } from 'react';
import { Dialog } from '../../../../common/components/organisms/Dialog/Dialog';
import { Button } from '../../../../common/components/atoms/Button/Button';
import { ctw } from '../../../../common/utils/ctw/ctw';
import { DialogContent } from '../../../../common/components/organisms/Dialog/Dialog.Content';
import { Select } from '../../../../common/components/atoms/Select/Select';
import { DialogFooter } from '../../../../common/components/organisms/Dialog/Dialog.Footer';
import { DialogClose } from '@radix-ui/react-dialog';
import { ICaseCallToActionLegacyProps } from './interfaces';
import { SelectItem } from '../../../../common/components/atoms/Select/Select.Item';
import { SelectContent } from '../../../../common/components/atoms/Select/Select.Content';
import { SelectTrigger } from '../../../../common/components/atoms/Select/Select.Trigger';
import { SelectValue } from '../../../../common/components/atoms/Select/Select.Value';
import { Input } from '../../../../common/components/atoms/Input/Input';
import { DialogTrigger } from '../../../../common/components/organisms/Dialog/Dialog.Trigger';
import { capitalize } from '../../../../common/utils/capitalize/capitalize';
import { Send } from 'lucide-react';
import { DialogTitle } from '../../../../common/components/organisms/Dialog/Dialog.Title';
import { DialogDescription } from '../../../../common/components/organisms/Dialog/Dialog.Description';
import { DialogHeader } from '../../../../common/components/organisms/Dialog/Dialog.Header';
import { MotionButton } from '@/common/components/molecules/MotionButton/MotionButton';
import { useCaseCallToActionLegacyLogic } from '@/lib/blocks/components/CaseCallToActionLegacy/hooks/useCaseCallToActionLegacyLogic/useCaseCallToActionLegacyLogic';

const motionButtonProps = {
  exit: { opacity: 0, transition: { duration: 0.2 } },
  initial: { y: 10, opacity: 0 },
  transition: { type: 'spring', bounce: 0.3 },
  animate: { y: 0, opacity: 1, transition: { duration: 0.2 } },
} satisfies ComponentProps<typeof MotionButton>;

export const CaseCallToActionLegacy: FunctionComponent<ICaseCallToActionLegacyProps> = ({
  value,
  data,
}) => {
  const {
    // Callbacks
    onMutateApproveCase,
    onMutateRevisionCase,
    onReasonChange,
    onCommentChange,
    // /Callbacks

    // State
    reason,
    comment,

    reasons,
    noReasons,
    isDisabled,
    isLoadingRevisionCase,
    reasonWithComment,
    // /State
  } = useCaseCallToActionLegacyLogic({
    parentWorkflowId: data?.parentWorkflowId,
    childWorkflowId: data?.childWorkflowId,
    childWorkflowContextSchema: data?.childWorkflowContextSchema,
  });

  if (value === 'Re-upload needed') {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <MotionButton
            {...motionButtonProps}
            animate={{
              ...motionButtonProps.animate,
              opacity: data?.disabled || isDisabled ? 0.5 : motionButtonProps.animate.opacity,
            }}
            size="wide"
            variant="warning"
            disabled={data?.disabled || isDisabled}
          >
            {value}
          </MotionButton>
        </DialogTrigger>
        <DialogContent className={`mb-96`}>
          <DialogHeader>
            <DialogTitle className={`text-2xl`}>Ask to re-upload</DialogTitle>
            <DialogDescription>
              <span className="mb-[10px] block">
                By clicking the button below, an email with a link will be sent to the customer,
                directing them to re-upload the documents you have marked as “re-upload needed”.
              </span>
              <span>
                The case’s status will then change to “Revisions” until the customer will provide
                the needed documents and fixes.
              </span>
            </DialogDescription>
          </DialogHeader>
          {!noReasons && (
            <div>
              <label className={`mb-2 block font-bold`} htmlFor={`reason`}>
                Reason
              </label>
              <Select onValueChange={onReasonChange} value={reason} id={`reason`}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {reasons?.map(reason => {
                    const reasonWithSpace = reason.replace(/_/g, ' ').toLowerCase();
                    const capitalizedReason = capitalize(reasonWithSpace);

                    return (
                      <SelectItem key={reason} value={reason} className={`capitalize`}>
                        {capitalizedReason}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          )}
          <div>
            <label className={`mb-2 block font-bold`} htmlFor={`comment`}>
              {noReasons ? 'Reason' : 'Comment'}
            </label>
            <Input
              onChange={event => {
                if (noReasons) {
                  onReasonChange(event.target.value);

                  return;
                }

                onCommentChange(event.target.value);
              }}
              value={noReasons ? reason : comment}
              id={noReasons ? `reason` : `comment`}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                className={ctw(`gap-x-2`, {
                  loading: isLoadingRevisionCase,
                })}
                disabled={isLoadingRevisionCase}
                onClick={onMutateRevisionCase(reasonWithComment)}
              >
                <Send size={18} />
                Send email
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // Approve
  return (
    <Button
      variant={`success`}
      disabled={data?.disabled || isDisabled}
      onClick={onMutateApproveCase}
    >
      {value}
    </Button>
  );
};
