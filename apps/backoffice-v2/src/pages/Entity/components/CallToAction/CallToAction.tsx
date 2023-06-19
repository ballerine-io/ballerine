import React, { FunctionComponent, useCallback, useState } from 'react';
import { Dialog } from '../../../../common/components/organisms/Dialog/Dialog';
import { DropdownMenu } from '../../../../common/components/molecules/DropdownMenu/DropdownMenu';
import { DropdownMenuTrigger } from '../../../../common/components/molecules/DropdownMenu/DropdownMenu.Trigger';
import { Button } from '../../../../common/components/atoms/Button/Button';
import { ctw } from '../../../../common/utils/ctw/ctw';
import { DropdownMenuContent } from '../../../../common/components/molecules/DropdownMenu/DropdownMenu.Content';
import { DropdownMenuLabel } from '../../../../common/components/molecules/DropdownMenu/DropdownMenu.Label';
import { DropdownMenuSeparator } from '../../../../common/components/molecules/DropdownMenu/DropdownMenu.Separator';
import { DialogTrigger } from '../../../../common/components/organisms/Dialog/Dialog.Trigger';
import { DropdownMenuItem } from '../../../../common/components/molecules/DropdownMenu/DropdownMenu.Item';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { DialogContent } from '../../../../common/components/organisms/Dialog/Dialog.Content';
import { DialogHeader } from '../../../../common/components/organisms/Dialog/Dialog.Header';
import { DialogTitle } from '../../../../common/components/organisms/Dialog/Dialog.Title';
import { DialogDescription } from '../../../../common/components/organisms/Dialog/Dialog.Description';
import { Select } from '../../../../common/components/atoms/Select/Select';
import { DialogFooter } from '../../../../common/components/organisms/Dialog/Dialog.Footer';
import { DialogClose } from '@radix-ui/react-dialog';
import { useParams } from 'react-router-dom';
import { ICallToActionProps } from './interfaces';
import { useAuthenticatedUserQuery } from '../../../../domains/auth/hooks/queries/useAuthenticatedUserQuery/useAuthenticatedUserQuery';
import { useCaseState } from '../Case/hooks/useCaseState/useCaseState';
import { useUpdateWorkflowByIdMutation } from '../../../../domains/workflows/hooks/mutations/useUpdateWorkflowByIdMutation/useUpdateWorkflowByIdMutation';
import toast from 'react-hot-toast';
import { SelectItem } from '../../../../common/components/atoms/Select/Select.Item';
import { SelectContent } from '../../../../common/components/atoms/Select/Select.Content';
import { SelectTrigger } from '../../../../common/components/atoms/Select/Select.Trigger';
import { SelectValue } from '../../../../common/components/atoms/Select/Select.Value';
import { useFilterId } from '../../../../common/hooks/useFilterId/useFilterId';
import { useWorkflowQuery } from '../../../../domains/workflows/hooks/queries/useWorkflowQuery/useWorkflowQuery';
import { Input } from '../../../../common/components/atoms/Input/Input';

export const CallToAction: FunctionComponent<ICallToActionProps> = ({ value, data }) => {
  const { entityId } = useParams();
  const [revisionReason, setRevisionReason] = useState('');
  const filterId = useFilterId();
  const { data: workflow } = useWorkflowQuery({ workflowId: entityId, filterId });
  const onRevisionReasonChange = useCallback(
    (value: string) => setRevisionReason(value),
    [setRevisionReason],
  );
  const { data: session } = useAuthenticatedUserQuery();
  const caseState = useCaseState(session?.user, workflow);
  const revisionReasons =
    workflow.workflowDefinition.contextSchema?.schema?.properties?.documents?.items?.properties?.decision?.properties?.revisionReason?.anyOf?.find(
      ({ enum: enum_ }) => !!enum_,
    )?.enum;
  const { mutate: mutateUpdateWorkflowById, isLoading: isLoadingUpdateWorkflowById } =
    useUpdateWorkflowByIdMutation({
      workflowId: workflow.id,
    });
  const onMutateUpdateWorkflowById =
    (
      payload:
        | {
            id: string;
            approvalStatus: 'rejected' | 'approved';
          }
        | {
            id: string;
            approvalStatus: 'revision';
            revisionReason: string;
          },
    ) =>
    () => {
      if (!payload?.id) {
        toast.error('Invalid task id');

        return;
      }

      const action = (
        {
          approved: 'approve_document',
          rejected: 'reject_document',
          revision: 'ask_resubmit_document',
        } as const
      )[payload.approvalStatus];

      const context = {
        documents: workflow.context.documents?.map(document => {
          if (document?.id !== payload?.id) return document;

          switch (payload?.approvalStatus) {
            case 'approved':
              return {
                ...document,
                decision: {
                  revisionReason: null,
                  rejectionReason: null,
                  status: payload?.approvalStatus,
                },
              };
            case 'rejected':
              return {
                ...document,
                decision: {
                  revisionReason: null,
                  // Change when rejection reason is implemented.
                  rejectionReason: document?.decision?.rejectionReason ?? '',
                  status: payload?.approvalStatus,
                },
              };
            case 'revision':
              return {
                ...document,
                decision: {
                  revisionReason: payload?.revisionReason,
                  rejectionReason: null,
                  status: payload?.approvalStatus,
                },
              };
            default:
              return document;
          }
        }),
      };
      return mutateUpdateWorkflowById({
        context,
        action,
      });
    };

  return value === 'Reject' ? (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
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
        </DropdownMenuTrigger>
        <DropdownMenuContent className={`min-w-[16rem]`} align={`end`}>
          <DropdownMenuLabel>{value}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DialogTrigger asChild>
            <DropdownMenuItem className={`cursor-pointer gap-x-2`}>
              <RotateCcw size={18} />
              Ask to re-submit
            </DropdownMenuItem>
          </DialogTrigger>
          <DropdownMenuItem
            className={`cursor-pointer gap-x-2 text-red-500`}
            onClick={onMutateUpdateWorkflowById({
              id: data?.id,
              approvalStatus: 'rejected',
            })}
          >
            <AlertTriangle className={`text-red-500`} size={18} />
            Block
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request document re-submission</DialogTitle>
          <DialogDescription>
            This action will send a request to the user to re-submit their document. State the
            reason for requesting a document re-submission.
          </DialogDescription>
        </DialogHeader>
        {!revisionReasons?.length ? (
          <Input
            placeholder={`Re-submission reason`}
            onChange={event => onRevisionReasonChange(event.target.value)}
          />
        ) : (
          <Select onValueChange={onRevisionReasonChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Re-submission reason" />
            </SelectTrigger>
            <SelectContent>
              {revisionReasons?.map(reason => {
                const reasonWithSpace = reason.replace(/_/g, ' ').toLowerCase();
                const capitalizedReason =
                  reasonWithSpace.charAt(0).toUpperCase() + reasonWithSpace.slice(1);

                return (
                  <SelectItem key={reason} value={reason}>
                    {capitalizedReason}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
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
                approvalStatus: 'revision',
                revisionReason,
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
