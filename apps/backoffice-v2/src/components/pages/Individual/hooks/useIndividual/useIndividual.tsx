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
import { ResubmissionReason } from 'components/organisms/Subject/hooks/useActions/useActions';
import { DialogFooter } from 'components/organisms/Dialog/Dialog.Footer';
import { DialogClose } from '@radix-ui/react-dialog';
import { Dialog } from 'components/organisms/Dialog/Dialog';
import React from 'react';
import { WarningAlert } from 'components/atoms/WarningAlert';
import { useUpdateWorkflowByIdMutation } from '../../../../../lib/react-query/mutations/useUpdateWorkflowByIdMutation/useUpdateWorkflowByIdMutation';
import { SubmitHandler } from 'react-hook-form';
import { AnyRecord } from '../../../../../types';
import { toStartCase } from '../../../../../utils/to-start-case/to-start-case';
import { Form } from 'components/organisms/Form/Form';
import { useStorageFilesQuery } from '../../../../../lib/react-query/queries/useStorageFilesQuery/useStorageFilesQuery';

export const useIndividual = () => {
  const { endUserId } = useParams();
  const { data: endUser, isLoading } = useEndUserWithWorkflowQuery(endUserId);
  const results = useStorageFilesQuery(
    endUser?.workflow?.context?.documents?.flatMap(({ pages }) =>
      pages?.map(({ ballerineFileId }) => ballerineFileId),
    ),
  );
  const { fullName, avatarUrl } = endUser ?? {};
  const selectedEndUser = {
    id: endUserId,
    fullName,
    avatarUrl,
  };
  const octetToFileType = (base64: string, fileType: string) =>
    base64?.replace(/application\/octet-stream/gi, fileType);
  const { mutate: mutateUpdateWorkflowById, isLoading: isLoadingUpdateWorkflowById } =
    useUpdateWorkflowByIdMutation({
      workflowId: endUser?.workflow?.runtimeDataId,
    });
  const onMutateUpdateWorkflowById =
    ({ id, approvalStatus }: { id: string; approvalStatus: 'rejected' | 'approved' }) =>
    () => {
      const data = endUser?.workflow?.documents?.find(({ id: documentId }) => documentId === id);
      const decisions = [...(endUser?.workflow?.workflowContext?.machineContext?.decisions ?? [])];
      const indexOfTask = decisions?.findIndex(({ taskId }) => taskId === id);

      if (indexOfTask < 0) {
        decisions.push({
          taskId: id,
          faceMatch: approvalStatus,
          idVerification: approvalStatus,
        });
      } else {
        decisions[indexOfTask] = {
          taskId: id,
          faceMatch: approvalStatus,
          idVerification: approvalStatus,
        };
      }

      return mutateUpdateWorkflowById({
        context: {
          decisions,
        },
      });
    };
  const onMutateTaskDecisionById = ({ context }: { context: AnyRecord }) =>
    mutateUpdateWorkflowById({
      context,
    });
  const components = {
    heading: ({ value }) => <h2 className={`ml-2 p-2 text-2xl font-bold`}>{value}</h2>,
    alert: ({ value }) => (
      <WarningAlert isOpen className={`w-6/12 text-base-content theme-dark:text-base-100`}>
        {value}
      </WarningAlert>
    ),
    container: ({ value, id }) => {
      return (
        <div
          className={ctw({
            'm-2 flex justify-end space-x-2 rounded border border-slate-300 p-2 text-slate-50':
              id === 'actions',
            'rounded border border-slate-300': id === 'alerts',
            'col-span-full':
              (id === 'actions' && value?.every(v => v?.type !== 'heading')) || id === 'alerts',
            'm-2 flex flex-col space-y-2 p-2': id === 'alerts',
          })}
        >
          {id === 'alerts' && <h4 className={`mb-2 text-lg font-bold`}>Issues</h4>}
          {id === 'actions' && (
            <h4 className={`mb-2 mr-auto text-lg font-bold text-base-content`}>Actions</h4>
          )}
          {value?.map((cell, index) => {
            const Cell = components[cell?.type];

            return <Cell key={index} {...cell} />;
          })}
        </div>
      );
    },
    callToAction: ({ value, data }) => {
      const isApprovedTask = endUser?.workflow?.workflowContext?.machineContext?.decisions?.some(
        ({ taskId, faceMatch, idVerification }) =>
          taskId === data?.id && faceMatch === 'approved' && idVerification === 'approved',
      );

      return value === 'Options' ? (
        <Dialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={ctw(
                  `btn justify-center before:mr-2 before:border-2 before:border-transparent before:content-[''] before:d-4 after:ml-2 after:border-2 after:border-transparent after:content-[''] after:d-4`,
                  {
                    // loading: debouncedIsLoadingRejectEndUser,
                  },
                )}
                // disabled={isLoading || !canReject}
              >
                Options
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className={`min-w-[16rem]`} align={`end`}>
              <DropdownMenuLabel>Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DialogTrigger asChild>
                <DropdownMenuItem className={`cursor-pointer`}>Ask to re-submit</DropdownMenuItem>
              </DialogTrigger>
              <DropdownMenuItem
                className={`cursor-pointer`}
                onClick={onMutateUpdateWorkflowById({
                  id: data?.id,
                  approvalStatus: 'rejected',
                })}
              >
                Reject
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
            <Select
            // onValueChange={onResubmissionReasonChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Re-submission reason" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(ResubmissionReason).map(reason => {
                  const reasonWithSpaceSpace = reason.replace(/_/g, ' ').toLowerCase();
                  const capitalizedReason =
                    reasonWithSpaceSpace.charAt(0).toUpperCase() + reasonWithSpaceSpace.slice(1);

                  return (
                    <SelectItem
                      key={reason}
                      value={reason}
                      disabled={reason !== ResubmissionReason.BLURRY_IMAGE}
                    >
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
                >
                  Confirm
                </button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ) : (
        <button
          className={ctw(
            `btn-success btn justify-center before:mr-2 before:border-2 before:border-transparent before:content-[''] before:d-4 after:ml-2 after:border-2 after:border-transparent after:content-[''] after:d-4`,
            {
              loading: isLoadingUpdateWorkflowById,
            },
          )}
          disabled={isLoadingUpdateWorkflowById || isApprovedTask}
          onClick={onMutateUpdateWorkflowById({
            id: data?.id,
            approvalStatus: data?.approvalStatus,
          })}
        >
          {value}
        </button>
      );
    },
    faceComparison: ({ value }) => (
      <div className={`m-2 rounded border border-slate-300 p-1`}>
        <h4 className={`mb-2 text-lg font-bold`}>Face Comparison</h4>
        <Subject.FaceMatch faceAUrl={value.faceAUrl} faceBUrl={value.faceBUrl} />
      </div>
    ),
    details: ({ value }) => {
      const defaultValues = value.data?.reduce((acc, curr) => {
        acc[curr.title] = curr.value;

        return acc;
      }, {});
      const onSubmit: SubmitHandler<Record<PropertyKey, unknown>> = data => {
        const context = {
          documents: endUser?.workflow?.context?.documents?.map(document => {
            if (document?.id !== value?.id) return document;

            return {
              ...document,
              properties: Object.keys(document?.properties).reduce((acc, curr) => {
                acc[curr] = {
                  ...document?.properties?.[curr],
                  value: data?.[curr],
                };

                return acc;
              }, {}),
            };
          }),
        };

        return onMutateTaskDecisionById({
          context,
        });
      };

      if (!value.data?.length) return;

      return (
        <div className={`m-2 rounded border border-slate-300 p-1`}>
          <Form
            options={{
              defaultValues,
            }}
            onSubmit={onSubmit}
            className={`flex h-full flex-col`}
          >
            {methods => (
              <>
                <legend>{value.title}</legend>
                <div className={`grid grid-cols-2 gap-2`}>
                  {value?.data?.map(({ title, isEditable, type }) => (
                    <div className={`flex flex-col`} key={title}>
                      <label htmlFor={title}>{toStartCase(camelCaseToSpace(title))}</label>
                      <input
                        {...methods.register(title)}
                        type={type === 'string' ? 'text' : type}
                        disabled={!isEditable}
                      />
                    </div>
                  ))}
                </div>
                <div className={`ml-2 mt-auto flex justify-end`}>
                  {value?.data?.some(({ isEditable }) => isEditable) && (
                    <button className={`btn`} type={'submit'}>
                      Save
                    </button>
                  )}
                </div>
              </>
            )}
          </Form>
        </div>
      );
    },
    multiDocuments: ({ value }) => {
      const documents = value.data.filter(({ imageUrl }) => !!imageUrl);

      return (
        <div className={`m-2 rounded border border-slate-300 p-1`}>
          <h4 className={`mb-2 text-lg font-bold`}>Documents</h4>
          <Subject.Documents documents={documents} />
        </div>
      );
    },
  };
  const tasks = endUser?.workflow?.context?.entity
    ? [
        [
          {
            type: 'details',
            value: {
              title: `${toStartCase(endUser?.workflow?.context?.entity?.type)} Information`,
              data: Object.entries(endUser?.workflow?.context?.entity?.data ?? {})?.map(
                ([title, value]) => ({
                  title,
                  value,
                  type: 'string',
                  isEditable: false,
                }),
              ),
            },
          },
        ],
        ...(endUser?.workflow?.context?.documents?.map(({ id, category, properties }, index) => [
          {
            id: 'actions',
            type: 'container',
            value: [
              {
                type: 'callToAction',
                value: 'Options',
                data: {
                  id,
                  approvalStatus: 'rejected',
                },
              },
              {
                type: 'callToAction',
                value: 'Approve',
                data: {
                  id,
                  approvalStatus: 'approved',
                },
              },
            ],
          },
          {
            type: 'details',
            value: {
              id,
              title: category,
              data: Object.entries(properties ?? {}).map(
                ([title, { value, type, isEditable }]) => ({
                  title,
                  value,
                  type,
                  isEditable,
                }),
              ),
            },
          },
          {
            type: 'multiDocuments',
            value: {
              data:
                endUser?.workflow?.context?.documents?.[index]?.pages?.map(
                  ({ type, metadata }, index) => ({
                    title: metadata?.side ? `${category} ${metadata?.side}` : category,
                    imageUrl:
                      type === 'pdf'
                        ? octetToFileType(results[index]?.data, type)
                        : results[index]?.data,
                  }),
                ) ?? [],
            },
          },
        ]) ?? []),
      ]
    : [];

  return {
    selectedEndUser,
    components,
    tasks,
  };
};
