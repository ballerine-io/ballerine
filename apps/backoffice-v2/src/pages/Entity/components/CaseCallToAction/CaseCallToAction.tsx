import React, { FunctionComponent } from 'react';
import { Dialog } from '../../../../common/components/organisms/Dialog/Dialog';
import { Button } from '../../../../common/components/atoms/Button/Button';
import { DialogContent } from '../../../../common/components/organisms/Dialog/Dialog.Content';
import { Select } from '../../../../common/components/atoms/Select/Select';
import { DialogFooter } from '../../../../common/components/organisms/Dialog/Dialog.Footer';
import { DialogClose } from '@radix-ui/react-dialog';
import { ICaseCallToActionProps } from './interfaces';
import { SelectItem } from '../../../../common/components/atoms/Select/Select.Item';
import { SelectContent } from '../../../../common/components/atoms/Select/Select.Content';
import { SelectTrigger } from '../../../../common/components/atoms/Select/Select.Trigger';
import { SelectValue } from '../../../../common/components/atoms/Select/Select.Value';
import { Input } from '../../../../common/components/atoms/Input/Input';
import { DialogTrigger } from '../../../../common/components/organisms/Dialog/Dialog.Trigger';
import { useCaseCallToActionLogic } from './hooks/useCaseCallToActionLogic/useCaseCallToActionLogic';
import { capitalize } from '../../../../common/utils/capitalize/capitalize';
import { DialogTitle } from '../../../../common/components/organisms/Dialog/Dialog.Title';
import { DialogDescription } from '../../../../common/components/organisms/Dialog/Dialog.Description';

export const CaseCallToAction: FunctionComponent<ICaseCallToActionProps> = ({ value, data }) => {
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
    revisionReasons,
    noReasons,
    isDisabled,
    // /State
  } = useCaseCallToActionLogic({
    parentWorkflowId: data?.parentWorkflowId,
    childWorkflowId: data?.childWorkflowId,
    childWorkflowContextSchema: data?.childWorkflowContextSchema,
  });

  if (value === 'Re-upload needed') {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button
            className={`bg-orange-400 hover:bg-orange-500`}
            disabled={data?.disabled || isDisabled}
          >
            {value}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Mark Document for Re-upload</DialogTitle>
          <DialogDescription>
            Once marked, you can initiate a request from the customer to re-upload, using the "Ask
            for all re-uploads" button, on the top of the screen.
          </DialogDescription>
          {!noReasons && (
            <div>
              <label className={`mb-2 block font-bold`} htmlFor={`reason`}>
                Add Reason
              </label>
              <Select onValueChange={onReasonChange} value={reason} id={`reason`}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {revisionReasons?.map(reason => {
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
          {noReasons && (
            <div>
              <label className={`mb-2 block font-bold`} htmlFor={`reason`}>
                Add Reason
              </label>
              <Input
                onChange={event => {
                  onReasonChange(event.target.value);
                }}
                value={reason}
                id={`reason`}
              />
            </div>
          )}
          <div>
            <label className={`mb-2 block font-bold`} htmlFor={`comment`}>
              Comment
            </label>
            <Input
              onChange={event => {
                onCommentChange(event.target.value);
              }}
              placeholder={`Add comment`}
              value={comment}
              id={`comment`}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button onClick={onMutateRevisionCase}>Approve</Button>
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
