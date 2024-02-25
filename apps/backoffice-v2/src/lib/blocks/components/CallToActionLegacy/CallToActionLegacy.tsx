import { AnimatePresence } from 'framer-motion';
import { ComponentProps, FunctionComponent } from 'react';

import { Send, X } from 'lucide-react';
import { Button } from '../../../../common/components/atoms/Button/Button';
import { Input } from '../../../../common/components/atoms/Input/Input';
import { Select } from '../../../../common/components/atoms/Select/Select';
import { SelectContent } from '../../../../common/components/atoms/Select/Select.Content';
import { SelectItem } from '../../../../common/components/atoms/Select/Select.Item';
import { SelectTrigger } from '../../../../common/components/atoms/Select/Select.Trigger';
import { SelectValue } from '../../../../common/components/atoms/Select/Select.Value';
import { MotionButton } from '../../../../common/components/molecules/MotionButton/MotionButton';
import { Dialog } from '../../../../common/components/molecules/Dialog/Dialog';
import { capitalize } from '../../../../common/utils/capitalize/capitalize';
import { ctw } from '../../../../common/utils/ctw/ctw';
import { ICallToActionLegacyProps } from './interfaces';
import { useCallToActionLegacyLogic } from '@/lib/blocks/components/CallToActionLegacy/hooks/useCallToActionLegacyLogic/useCallToActionLegacyLogic';

const motionButtonProps = {
  exit: { opacity: 0, transition: { duration: 0.2 } },
  initial: { y: 10, opacity: 0 },
  transition: { type: 'spring', bounce: 0.3 },
  animate: { y: 0, opacity: 1, transition: { duration: 0.2 } },
} satisfies ComponentProps<typeof MotionButton>;

export const CallToActionLegacy: FunctionComponent<ICallToActionLegacyProps> = ({ value }) => {
  const {
    contextUpdateMethod,
    revisionReasons,
    rejectionReasons,
    onReuploadReset,
    onReuploadNeeded,
    isLoadingReuploadNeeded,
    onDialogClose,
    id,
    workflow,
    decision,
    disabled,
    dialog,
  } = value?.props || {};

  const {
    onMutateTaskDecisionById,
    isLoadingTaskDecisionById,
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
    isReuploadResetable,
    handleDialogClose,
    DialogDescription,
  } = useCallToActionLegacyLogic({
    contextUpdateMethod,
    revisionReasons,
    rejectionReasons,
    onDialogClose,
    onReuploadReset,
    workflow,
    onReuploadNeeded,
    isLoadingReuploadNeeded,
    dialog,
  });

  if (value?.text === 'Reject') {
    return (
      <Dialog
        onOpenChange={handleDialogClose}
        trigger={
          <MotionButton
            {...motionButtonProps}
            animate={{
              ...motionButtonProps.animate,
              opacity: disabled ? 0.5 : motionButtonProps.animate.opacity,
            }}
            size="wide"
            variant="destructive"
            className={ctw({ loading: isLoadingTaskDecisionById })}
            disabled={isLoadingTaskDecisionById || disabled}
          >
            {value.text}
          </MotionButton>
        }
        content={
          <>
            <div>
              <label className={`mb-2 block font-bold`} htmlFor={`action`}>
                Action
              </label>
              <Select onValueChange={onActionChange} value={action} id={`action`}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {actions?.map(({ label, value }) => {
                    return (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
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
                      const capitalizedReason =
                        reasonWithSpace.charAt(0).toUpperCase() + reasonWithSpace.slice(1);

                      return (
                        <SelectItem
                          key={`${action}${reason}`}
                          value={reason}
                          className={`capitalize`}
                        >
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
          </>
        }
        close={
          <Button
            variant={`destructive`}
            className={ctw(`gap-x-2`, {
              loading: isLoadingTaskDecisionById,
            })}
            onClick={onMutateTaskDecisionById({
              id,
              decision: action,
              reason: comment ? `${reason} - ${comment}` : reason,
            })}
          >
            Confirm
          </Button>
        }
      />
    );
  }

  if (value?.text === 'Re-upload needed') {
    return (
      <Dialog
        onOpenChange={handleDialogClose}
        trigger={
          <MotionButton
            {...motionButtonProps}
            animate={{
              ...motionButtonProps.animate,
              opacity: disabled ? 0.5 : motionButtonProps.animate.opacity,
            }}
            size="wide"
            variant="warning"
            disabled={disabled}
            className={ctw({ 'flex gap-2': isReuploadResetable })}
          >
            {value.text}
            {isReuploadResetable && (
              <X
                className="h-4 w-4 cursor-pointer"
                onClick={event => {
                  event.stopPropagation();
                  onReuploadReset?.();
                }}
              />
            )}
          </MotionButton>
        }
        title={'Mark document for re-upload'}
        description={<DialogDescription />}
        content={
          <>
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
          </>
        }
        close={
          <Button
            className={ctw(`gap-x-2`, {
              loading: isLoadingReuploadNeeded,
            })}
            onClick={onReuploadNeeded({
              workflowId: workflow?.id,
              documentId: id,
              reason: comment ? `${reason} - ${comment}` : reason,
            })}
          >
            {workflowLevelResolution && 'Confirm'}
            {!workflowLevelResolution && (
              <>
                <Send size={18} />
                Send email
              </>
            )}
          </Button>
        }
        props={{
          title: {
            className: `text-2xl`,
          },
          content: {
            className: `mb-96`,
          },
          description: {
            asChild: true,
          },
        }}
      />
    );
  }

  return (
    <AnimatePresence>
      <MotionButton
        {...motionButtonProps}
        animate={{
          ...motionButtonProps.animate,
          opacity: disabled ? 0.5 : motionButtonProps.animate.opacity,
        }}
        size="wide"
        variant="success"
        className={ctw({ loading: isLoadingTaskDecisionById })}
        disabled={isLoadingTaskDecisionById || disabled}
        onClick={onMutateTaskDecisionById({
          id,
          decision,
        })}
      >
        {value?.text}
      </MotionButton>
    </AnimatePresence>
  );
};
