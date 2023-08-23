import { AnimatePresence } from 'framer-motion';
import React, { ComponentProps, FunctionComponent } from 'react';
import { DialogClose } from '@radix-ui/react-dialog';

import { Dialog } from '../../../../common/components/organisms/Dialog/Dialog';
import { ctw } from '../../../../common/utils/ctw/ctw';
import { DialogContent } from '../../../../common/components/organisms/Dialog/Dialog.Content';
import { Select } from '../../../../common/components/atoms/Select/Select';
import { DialogFooter } from '../../../../common/components/organisms/Dialog/Dialog.Footer';
import { ICallToActionProps } from './interfaces';
import { SelectItem } from '../../../../common/components/atoms/Select/Select.Item';
import { SelectContent } from '../../../../common/components/atoms/Select/Select.Content';
import { SelectTrigger } from '../../../../common/components/atoms/Select/Select.Trigger';
import { SelectValue } from '../../../../common/components/atoms/Select/Select.Value';
import { Input } from '../../../../common/components/atoms/Input/Input';
import { DialogTrigger } from '../../../../common/components/organisms/Dialog/Dialog.Trigger';
import { useCallToActionLogic } from './hooks/useCallToActionLogic/useCallToActionLogic';
import { MotionButton } from '../../../../common/components/molecules/MotionButton/MotionButton';
import { Button } from '../../../../common/components/atoms/Button/Button';
import { DialogHeader } from '../../../../common/components/organisms/Dialog/Dialog.Header';
import { DialogTitle } from '../../../../common/components/organisms/Dialog/Dialog.Title';
import { DialogDescription } from '../../../../common/components/organisms/Dialog/Dialog.Description';
import { capitalize } from '../../../../common/utils/capitalize/capitalize';
import { Send } from 'lucide-react';

const motionProps: ComponentProps<typeof MotionButton> = {
  exit: { opacity: 0, transition: { duration: 0.2 } },
  initial: { y: 10, opacity: 0 },
  transition: { type: 'spring', bounce: 0.3 },
  animate: { y: 0, opacity: 1, transition: { duration: 0.2 } },
};

export const CallToAction: FunctionComponent<ICallToActionProps> = ({ value, data }) => {
  const {
    onMutateTaskDecisionById,
    isLoadingTaskDecisionById,
    caseState,
    action,
    actions,
    onActionChange,
    reasons,
    reason,
    onReasonChange,
    comment,
    onCommentChange,
    noReasons,
    workflowLevelResolution,
  } = useCallToActionLogic();

  return value === 'Re-upload needed' ? (
    <Dialog>
      <AnimatePresence>
        <DialogTrigger asChild>
          <MotionButton
            {...motionProps}
            variant="warning"
            disabled={!caseState.actionButtonsEnabled || data?.disabled}
          >
            {value}
          </MotionButton>
        </DialogTrigger>
      </AnimatePresence>
      <DialogContent className={`mb-96`}>
        <DialogHeader>
          <DialogTitle className={`text-2xl`}>Ask for all re-uploads</DialogTitle>
          <DialogDescription asChild>
            <p className="text-sm">
              {workflowLevelResolution ? (
                `Once marked, you can use the “Ask for all re-uploads” button at the top of the
                  screen to initiate a request for the customer to re-upload all of the documents
                  you have marked for re-upload.`
              ) : (
                <>
                  <span className="mb-[10px] block">
                    By clicking the button below, an email with a link will be sent to the customer,
                    directing them to re-upload the documents you have marked as “re-upload needed”.
                  </span>
                  <span>
                    The case’s status will then change to “Revisions” until the customer will
                    provide the needed documents and fixes.
                  </span>
                </>
              )}
            </p>
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
                loading: isLoadingTaskDecisionById,
              })}
              onClick={onMutateTaskDecisionById({
                id: data?.id,
                decision: action,
                reason: comment ? `${reason} - ${comment}` : reason,
              })}
            >
              {workflowLevelResolution ? (
                'Approve'
              ) : (
                <>
                  <Send size={18} />
                  Send email
                </>
              )}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ) : (
    <AnimatePresence>
      <MotionButton
        {...motionProps}
        variant="success"
        className={ctw({ loading: isLoadingTaskDecisionById })}
        disabled={isLoadingTaskDecisionById || data?.disabled || !caseState.actionButtonsEnabled}
        onClick={onMutateTaskDecisionById({
          id: data?.id,
          decision: data?.decision,
        })}
      >
        {value}
      </MotionButton>
    </AnimatePresence>
  );
};
