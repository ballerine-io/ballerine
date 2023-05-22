import { useParams } from '@tanstack/react-router';
import { camelCaseToSpace } from '../../../../../utils/camel-case-to-space/camel-case-to-space';
import { useEndUserWithWorkflowQuery } from '../../../../../lib/react-query/queries/useEndUserWithWorkflowQuery/useEndUserWithWorkflowQuery';
import { Subject } from 'components/organisms/Subject/Subject';
import { ctw } from '../../../../../utils/ctw/ctw';
import { DropdownMenu } from 'components/molecules/DropdownMenu/DropdownMenu';
import { DropdownMenuTrigger } from 'components/molecules/DropdownMenu/DropdownMenu.Trigger';
import { DropdownMenuContent } from 'components/molecules/DropdownMenu/DropdownMenu.Content';
import { DropdownMenuLabel } from 'components/molecules/DropdownMenu/DropdownMenu.Label';
import { DropdownMenuSeparator } from 'components/molecules/DropdownMenu/DropdownMenu.Separator';
import { DropdownMenuItem } from 'components/molecules/DropdownMenu/DropdownMenu.Item';
import { DialogTrigger } from 'components/organisms/Dialog/Dialog.Trigger';
import { DialogContent } from 'components/organisms/Dialog/Dialog.Content';
import { DialogHeader } from 'components/organisms/Dialog/Dialog.Header';
import { DialogTitle } from 'components/organisms/Dialog/Dialog.Title';
import { DialogDescription } from 'components/organisms/Dialog/Dialog.Description';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'components/atoms/Select/Select';
import { DialogFooter } from 'components/organisms/Dialog/Dialog.Footer';
import { DialogClose } from '@radix-ui/react-dialog';
import { Dialog } from 'components/organisms/Dialog/Dialog';
import React, { useCallback, useState } from 'react';
import { WarningAlert } from 'components/atoms/WarningAlert';
import { useUpdateWorkflowByIdMutation } from '../../../../../lib/react-query/mutations/useUpdateWorkflowByIdMutation/useUpdateWorkflowByIdMutation';
import { Separator } from 'components/atoms/Separator/separator';
import { Button } from 'components/atoms/Button/button';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { SubmitHandler } from 'react-hook-form';
import { AnyRecord } from '../../../../../types';
import { toStartCase } from '../../../../../utils/to-start-case/to-start-case';
import { Form } from 'components/organisms/Form/Form';
import { useStorageFilesQuery } from '../../../../../lib/react-query/queries/useStorageFilesQuery/useStorageFilesQuery';
import toast from 'react-hot-toast';
import { useCaseState } from 'components/organisms/Subject/hooks/useCaseState/useCaseState';
import { useGetSessionQuery } from '../../../../../lib/react-query/queries/useGetSessionQuery/useGetSessionQuery';
import { useFilterEntity } from 'hooks/useFilterEntity/useFilterEntity';

export const useIndividual = () => {
  const { endUserId } = useParams();
  const { data: endUser, isLoading } = useEndUserWithWorkflowQuery(endUserId);
  const results = useStorageFilesQuery(
    endUser?.workflow?.workflowContext?.machineContext?.documents?.flatMap(({ pages }) =>
      pages?.map(({ ballerineFileId }) => ballerineFileId),
    ),
  );
  const entity = useFilterEntity();
  const selectedEndUser = {
    id: endUserId,
    fullName: entity === 'individuals' ? endUser?.fullName : endUser?.companyName,
    avatarUrl: endUser?.avatarUrl,
  };
  const octetToFileType = (base64: string, fileType: string) =>
    base64?.replace(/application\/octet-stream/gi, fileType);
  const { mutate: mutateUpdateWorkflowById, isLoading: isLoadingUpdateWorkflowById } =
    useUpdateWorkflowByIdMutation({
      workflowId: endUser?.workflow?.runtimeDataId,
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
        documents: endUser?.workflow?.workflowContext?.machineContext?.documents?.map(document => {
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
  const onMutateTaskDecisionById = ({
    context,
    action,
  }: {
    context: AnyRecord;
    action: Parameters<typeof mutateUpdateWorkflowById>[0]['action'];
  }) =>
    mutateUpdateWorkflowById({
      context,
      action,
    });
  const components = {
    heading: ({ value }) => <h2 className={`ml-2 mt-6 p-2 text-2xl font-bold`}>{value}</h2>,
    alert: ({ value }) => (
      <WarningAlert isOpen className={`w-6/12 text-base-content theme-dark:text-base-100`}>
        {value}
      </WarningAlert>
    ),
    container: ({ value, id }) => {
      return (
        <div
          className={ctw({
            'm-2 mt-6 flex justify-end space-x-2 rounded p-2 text-slate-50': id === 'actions',
            rounded: id === 'alerts',
            'col-span-full': id === 'alerts' || id === 'header',
            'grid grid-cols-2': id === 'header',
            'm-2 flex flex-col space-y-2 p-2': id === 'alerts',
          })}
        >
          {value?.map((cell, index) => {
            const Cell = components[cell?.type];

            return <Cell key={index} {...cell} />;
          })}
        </div>
      );
    },
    callToAction: ({ value, data }) => {
      const [revisionReason, setRevisionReason] = useState('');
      const onRevisionReasonChange = useCallback(
        (value: string) => setRevisionReason(value),
        [setRevisionReason],
      );
      const revisionReasons =
        endUser?.workflow?.contextSchema?.schema?.properties?.documents?.items?.properties?.decision?.properties?.revisionReason?.anyOf?.find(
          ({ enum: enum_ }) => !!enum_,
        )?.enum;
      const isDisabled = data?.disabled || false;

      return value === 'Reject' ? (
        <Dialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant={`destructive`}
                className={ctw({
                  // loading: debouncedIsLoadingRejectEndUser,
                })}
                // disabled={isLoading || !canReject}
                disabled={!caseState.actionButtonsEnabled || isDisabled}
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
            <DialogFooter>
              <DialogClose asChild>
                <button
                  className={ctw(`btn-error btn justify-center`)}
                  // onClick={onMutateRejectEndUser({
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
          disabled={isLoadingUpdateWorkflowById || isDisabled || !caseState.actionButtonsEnabled}
          onClick={onMutateUpdateWorkflowById({
            id: data?.id,
            approvalStatus: data?.approvalStatus,
          })}
        >
          {value}
        </Button>
      );
    },
    faceComparison: ({ value }) => (
      <div className={`m-2 rounded p-1`}>
        <h4 className={`mb-2 text-lg`}>Face Comparison</h4>
        <Subject.FaceMatch faceAUrl={value.faceAUrl} faceBUrl={value.faceBUrl} />
      </div>
    ),
    details: ({ id, value }) => {
      const defaultValues = value.data?.reduce((acc, curr) => {
        acc[curr.title] = curr.value;

        return acc;
      }, {});
      const onSubmit: SubmitHandler<Record<PropertyKey, unknown>> = data => {
        const context = {
          documents: endUser?.workflow?.workflowContext?.machineContext?.documents?.map(
            document => {
              if (document?.id !== value?.id) return document;

              return {
                ...document,
                properties: Object.keys(document?.properties).reduce((acc, curr) => {
                  acc[curr] = data?.[curr];

                  return acc;
                }, {}),
              };
            },
          ),
        };

        return onMutateTaskDecisionById({
          context,
          action: 'update_document_properties',
        });
      };

      if (!value.data?.length) return;

      return (
        <div
          className={ctw(`m-2 rounded p-1`, {
            'pt-4': id === 'entity-details',
          })}
        >
          <Form
            options={{
              defaultValues,
            }}
            onSubmit={onSubmit}
            className={`flex h-full flex-col`}
          >
            {methods => (
              <>
                <legend className={`sr-only text-lg font-bold`}>{value?.title}</legend>
                <div
                  className={ctw(`grid grid-cols-2 gap-4`, {
                    'grid-cols-3': id === 'entity-details',
                  })}
                >
                  {value?.data?.map(({ title, isEditable, type, format, pattern }) => (
                    <div className={`flex flex-col`} key={title}>
                      <label htmlFor={title} className={`font-bold`}>
                        {toStartCase(camelCaseToSpace(title))}
                      </label>
                      <input
                        {...methods.register(title)}
                        type={!format ? (type === 'string' ? 'text' : type) : format}
                        disabled={!isEditable}
                        className={ctw(`disabled:bg-background`, {
                          'rounded border border-border p-1': isEditable,
                        })}
                        pattern={pattern}
                        autoComplete={'off'}
                      />
                    </div>
                  ))}
                </div>
                <div className={`mt-4 flex justify-end`}>
                  {value?.data?.some(({ isEditable }) => isEditable) && (
                    <Button type={'submit'}>Save</Button>
                  )}
                </div>
              </>
            )}
          </Form>
          <Separator className={`my-2`} />
        </div>
      );
    },
    multiDocuments: ({ value }) => {
      const documents = value.data.filter(({ imageUrl }) => !!imageUrl);

      return (
        <div className={`m-2 rounded p-1`}>
          <Subject.Documents
            documents={documents}
            isLoading={results.some(({ isFetching }) => isFetching)}
          />
        </div>
      );
    },
  };
  const { data: session } = useGetSessionQuery();
  const caseState = useCaseState(session?.user, endUser?.workflow);
  const tasks = endUser?.workflow?.workflowContext?.machineContext?.entity
    ? [
        ...(endUser?.workflow?.workflowContext?.machineContext?.documents?.map(
          ({ id, type, category, issuer, properties, propertiesSchema, decision }, index) => {
            return [
              {
                id: 'header',
                type: 'container',
                value: [
                  {
                    type: 'heading',
                    value: category,
                  },
                  {
                    id: 'actions',
                    type: 'container',
                    value: [
                      {
                        type: 'callToAction',
                        value: 'Reject',
                        data: {
                          id,
                          disabled: Boolean(decision),
                          approvalStatus: 'rejected',
                        },
                      },
                      {
                        type: 'callToAction',
                        value: 'Approve',
                        data: {
                          id,
                          disabled: Boolean(decision),
                          approvalStatus: 'approved',
                        },
                      },
                    ],
                  },
                ],
              },
              {
                type: 'container',
                value: [
                  {
                    id: 'decision',
                    type: 'details',
                    value: {
                      id,
                      title: category,
                      data: Object.entries(propertiesSchema?.properties ?? {})?.map(
                        ([title, { type, format, pattern, isEditable = true }]) => ({
                          title,
                          value: properties?.[title] ?? '',
                          type,
                          format,
                          pattern,
                          isEditable: caseState.writeEnabled && isEditable,
                        }),
                      ),
                    },
                  },
                  {
                    type: 'details',
                    value: {
                      id,
                      title: 'Decision',
                      data: Object.entries(decision ?? {}).map(([title, value]) => ({
                        title,
                        value,
                      })),
                    },
                  },
                ],
              },
              {
                type: 'multiDocuments',
                value: {
                  data:
                    endUser?.workflow?.workflowContext?.machineContext?.documents?.[
                      index
                    ]?.pages?.map(({ type, metadata }, index) => ({
                      title: metadata?.side ? `${category} ${metadata?.side}` : category,
                      imageUrl:
                        type === 'pdf'
                          ? octetToFileType(results[index]?.data, type)
                          : results[index]?.data,
                    })) ?? [],
                },
              },
            ];
          },
        ) ?? []),
        [
          {
            id: 'entity-details',
            type: 'details',
            value: {
              title: `${toStartCase(
                endUser?.workflow?.workflowContext?.machineContext?.entity?.type,
              )} Information`,
              data: Object.entries(
                endUser?.workflow?.workflowContext?.machineContext?.entity?.data ?? {},
              )?.map(([title, value]) => ({
                title,
                value,
                type: 'string',
                isEditable: false,
              })),
            },
          },
        ],
      ]
    : [];

  return {
    selectedEndUser,
    components,
    tasks,
  };
};
