import React, { FunctionComponent } from 'react';
import { Dialog } from '../../../../common/components/organisms/Dialog/Dialog';
import { Button } from '../../../../common/components/atoms/Button/Button';
import { ctw } from '../../../../common/utils/ctw/ctw';
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

export const CaseCallToAction: FunctionComponent<ICaseCallToActionProps> = ({ value, data }) => {
  const {
    // Callbacks
    onMutateApproveCase,
    onMutateRevisionCase,
    onMutateRejectCase,
    onActionChange,
    onReasonChange,
    onCommentChange,
    // /Callbacks

    // State
    actions,
    action,
    reason,
    comment,
    reasons,
    noReasons,
    isDisabled,
    // /State
  } = useCaseCallToActionLogic({
    parentWorkflowId: data?.parentWorkflowId,
    childWorkflowId: data?.childWorkflowId,
    childWorkflowContextSchema: data?.childWorkflowContextSchema,
  });

  if (value === 'Reject') {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant={`destructive`} disabled={data?.disabled || isDisabled}>
            {value}
          </Button>
        </DialogTrigger>
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
                    const capitalizedReason = capitalize(reasonWithSpace);

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
                className={ctw(`btn btn-error justify-center`)}
                onClick={action === 'revision' ? onMutateRevisionCase : onMutateRejectCase}
              >
                Confirm
              </button>
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
