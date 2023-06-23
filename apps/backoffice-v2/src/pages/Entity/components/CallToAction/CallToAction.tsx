import React, { FunctionComponent } from 'react';
import { Dialog } from '../../../../common/components/organisms/Dialog/Dialog';
import { Button } from '../../../../common/components/atoms/Button/Button';
import { ctw } from '../../../../common/utils/ctw/ctw';
import { DialogContent } from '../../../../common/components/organisms/Dialog/Dialog.Content';
import { Select } from '../../../../common/components/atoms/Select/Select';
import { DialogFooter } from '../../../../common/components/organisms/Dialog/Dialog.Footer';
import { DialogClose } from '@radix-ui/react-dialog';
import { ICallToActionProps } from './interfaces';
import { SelectItem } from '../../../../common/components/atoms/Select/Select.Item';
import { SelectContent } from '../../../../common/components/atoms/Select/Select.Content';
import { SelectTrigger } from '../../../../common/components/atoms/Select/Select.Trigger';
import { SelectValue } from '../../../../common/components/atoms/Select/Select.Value';
import { Input } from '../../../../common/components/atoms/Input/Input';
import { DialogTrigger } from '../../../../common/components/organisms/Dialog/Dialog.Trigger';
import { useCallToActionLogic } from './hooks/useCallToActionLogic/useCallToActionLogic';

export const CallToAction: FunctionComponent<ICallToActionProps> = ({ value, data }) => {
  const {
    onMutateUpdateWorkflowById,
    isLoadingUpdateWorkflowById,
    caseState,
    action,
    actions,
    onActionChange,
    reasons,
    reason,
    onReasonChange,
  } = useCallToActionLogic();

  return value === 'Reject' ? (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={`destructive`}
          className={ctw({
            // loading: debouncedIsLoadingRejectEntity,
          })}
          // disabled={isLoading || !canReject}
          disabled={!caseState.actionButtonsEnabled || data?.disabled}
        >
          {value}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <div>
          <h4 className={`mb-1 font-bold`}>Action</h4>
          <Select onValueChange={onActionChange} value={action}>
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
        {!reasons?.length ? (
          <Input placeholder={`Reason`} onChange={event => onReasonChange(event.target.value)} />
        ) : (
          <div>
            <h4 className={`mb-1 font-bold`}>Reason</h4>
            <Select onValueChange={onReasonChange} value={reason}>
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
        <DialogFooter>
          <DialogClose asChild>
            <button
              className={ctw(`btn-error btn justify-center`)}
              // onClick={onMutateRejectEntity({
              //   action: Action.RESUBMIT,
              // Currently hardcoded to documentOne.
              // documentToResubmit,
              // resubmissionReason,
              // })}
              // disabled={!resubmissionReason}
              onClick={onMutateUpdateWorkflowById({
                id: data?.id,
                approvalStatus: action,
                reason,
              })}
            >
              Confirm
            </button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ) : (
    <Button
      variant={`success`}
      className={ctw({
        loading: isLoadingUpdateWorkflowById,
      })}
      disabled={isLoadingUpdateWorkflowById || data?.disabled || !caseState.actionButtonsEnabled}
      onClick={onMutateUpdateWorkflowById({
        id: data?.id,
        approvalStatus: data?.approvalStatus,
      })}
    >
      {value}
    </Button>
  );
};
