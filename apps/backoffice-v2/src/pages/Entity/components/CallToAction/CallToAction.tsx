import { DialogClose } from '@radix-ui/react-dialog';
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
import { Dialog } from '../../../../common/components/organisms/Dialog/Dialog';
import { DialogContent } from '../../../../common/components/organisms/Dialog/Dialog.Content';
import { DialogDescription } from '../../../../common/components/organisms/Dialog/Dialog.Description';
import { DialogFooter } from '../../../../common/components/organisms/Dialog/Dialog.Footer';
import { DialogHeader } from '../../../../common/components/organisms/Dialog/Dialog.Header';
import { DialogTitle } from '../../../../common/components/organisms/Dialog/Dialog.Title';
import { DialogTrigger } from '../../../../common/components/organisms/Dialog/Dialog.Trigger';
import { capitalize } from '../../../../common/utils/capitalize/capitalize';
import { ctw } from '../../../../common/utils/ctw/ctw';
import { DocumentPicker } from './components/DocumentPicker';
import { useCallToActionLogic } from './hooks/useCallToActionLogic/useCallToActionLogic';
import { ICallToActionProps } from './interfaces';

const motionProps: ComponentProps<typeof MotionButton> = {
  exit: { opacity: 0, transition: { duration: 0.2 } },
  initial: { y: 10, opacity: 0 },
  transition: { type: 'spring', bounce: 0.3 },
  animate: { y: 0, opacity: 1, transition: { duration: 0.2 } },
};

export const CallToAction: FunctionComponent<ICallToActionProps> = ({ value }) => {
  const {
    documentSelection,
    contextUpdateMethod,
    revisionReasons,
    rejectionReasons,
    onReuploadReset,
    onDialogClose,
    id,
    decision,
    disabled,
  } = value?.props || {};

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
    isReuploadResetable,
    documentPickerProps,
    handleDialogClose,
  } = useCallToActionLogic({
    contextUpdateMethod,
    revisionReasons,
    rejectionReasons,
    documentSelection,
    onDialogClose,
    onReuploadReset,
  });

  if (value?.text === 'Reject') {
    return (
      <Dialog onOpenChange={handleDialogClose}>
        <AnimatePresence>
          <DialogTrigger asChild>
            <MotionButton
              {...motionProps}
              size="wide"
              variant="destructive"
              className={ctw({ loading: isLoadingTaskDecisionById })}
              disabled={isLoadingTaskDecisionById || disabled || !caseState.actionButtonsEnabled}
            >
              {value.text}
            </MotionButton>
          </DialogTrigger>
        </AnimatePresence>
        <DialogContent>
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
          <DialogFooter>
            <DialogClose asChild>
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
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  if (value?.text === 'Re-upload needed') {
    return (
      <Dialog onOpenChange={handleDialogClose}>
        <AnimatePresence>
          <DialogTrigger asChild>
            <MotionButton
              {...motionProps}
              size="wide"
              variant="warning"
              disabled={!caseState.actionButtonsEnabled || disabled}
              className={ctw({ 'flex gap-2': isReuploadResetable })}
            >
              {value.text}
              {isReuploadResetable && (
                <X
                  className="h-4 w-4 cursor-pointer"
                  onClick={event => {
                    event.stopPropagation();
                    onReuploadReset && onReuploadReset();
                  }}
                />
              )}
            </MotionButton>
          </DialogTrigger>
        </AnimatePresence>
        <DialogContent className={`mb-96`}>
          <DialogHeader>
            <DialogTitle className={`text-2xl`}>Mark document for re-upload</DialogTitle>
            <DialogDescription asChild>
              <p className="text-sm">
                {workflowLevelResolution ? (
                  `Once marked, you can use the “Ask for all re-uploads” button at the top of the
                  screen to initiate a request for the customer to re-upload all of the documents
                  you have marked for re-upload.`
                ) : (
                  <>
                    <span className="mb-[10px] block">
                      By clicking the button below, an email with a link will be sent to the
                      customer, directing them to re-upload the documents you have marked as
                      “re-upload needed”.
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
          {documentSelection && <DocumentPicker {...documentPickerProps} value={id} />}
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
                  id,
                  decision: action,
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
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <AnimatePresence>
      <MotionButton
        {...motionProps}
        size="wide"
        variant="success"
        className={ctw({ loading: isLoadingTaskDecisionById })}
        disabled={isLoadingTaskDecisionById || disabled || !caseState.actionButtonsEnabled}
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
