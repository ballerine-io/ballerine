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
  } = useCallToActionLogic();

  return value === 'Reject' ? (
    <Dialog>
      <AnimatePresence>
        <DialogTrigger asChild>
          <MotionButton
            {...motionProps}
            variant={`destructive`}
            disabled={!caseState.actionButtonsEnabled || data?.disabled}
          >
            {value}
          </MotionButton>
        </DialogTrigger>
      </AnimatePresence>
      <DialogContent>
        <div>
          <label className={`mb-1 font-bold`} htmlFor={`action`}>
            Action
          </label>
          <Select onValueChange={onActionChange} value={action} id={`action`}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {actions?.map(({ label, value }) => {
                return (
                  <SelectItem key={action} value={value}>
                    {label}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
        {!noReasons && (
          <div>
            <label className={`mb-1 font-bold`} htmlFor={`reason`}>
              Reason
            </label>
            <Select onValueChange={onReasonChange} value={reason} id={`reason`}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {reasons?.map(reason => {
                  const reasonWithSpace = reason.replace(/_/g, ' ').toLowerCase();
                  const capitalizedReason =
                    reasonWithSpace.charAt(0).toUpperCase() + reasonWithSpace.slice(1);

                  return (
                    <SelectItem key={`${action}${reason}`} value={reason} className={`capitalize`}>
                      {capitalizedReason}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        )}
        <div>
          <label className={`mb-1 font-bold`} htmlFor={`comment`}>
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
            <button
              className={ctw(`btn-error btn justify-center`)}
              // onClick={onMutateRejectEntity({
              //   action: Action.REVISION,
              // Currently hardcoded to documentOne.
              // documentToRevision,
              // revisionReason,
              // })}
              // disabled={!revisionReason}
              onClick={onMutateTaskDecisionById({
                id: data?.id,
                decision: action,
                reason: comment ? `${reason} - ${comment}` : reason,
              })}
            >
              Confirm
            </button>
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
