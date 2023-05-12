import { useParams } from '@tanstack/react-router';
import { camelCaseToSpace } from '../../../../../utils/camel-case-to-space/camel-case-to-space';
import { useEndUserWithWorkflowQuery } from '../../../../../lib/react-query/queries/useEndUserWithWorkflowQuery/useEndUserWithWorkflowQuery';
import { underscoreToSpace } from '../../../../../utils/underscore-to-space/underscore-to-space';
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
import { useStorageFilesQuery } from '../../../../../lib/react-query/queries/useStorageFilesQuery/useStorageFilesQuery';

export const useIndividual = () => {
  const { endUserId } = useParams();
  const { data: endUser, isLoading } = useEndUserWithWorkflowQuery(endUserId);
  const id = endUser?.workflow?.workflowContext?.machineContext?.id;
  const selfie = endUser?.workflow?.workflowContext?.machineContext?.selfie;
  const certificateOfIncorporation =
    endUser?.workflow?.workflowContext?.machineContext?.certificateOfIncorporation;
  const [{ data: idUrl }, { data: selfieUrl }, { data: certificateOfIncorporationUrl }] =
    useStorageFilesQuery([id?.id, selfie?.id, certificateOfIncorporation?.id]);
  const {
    firstName,
    middleName,
    lastName,
    fullName,
    phone,
    email,
    dateOfBirth,
    placeOfBirth,
    sex,
    avatarUrl,
    passport: passportInfo,
    address: addressInfo,
    checkResults,
  } = endUser ?? {};
  const personalInfo = {
    firstName,
    middleName,
    lastName,
    phone,
    email,
    dateOfBirth,
    placeOfBirth,
    sex,
  };
  const documents = [
    {
      url: idUrl,
      doctype: id?.type,
    },
    {
      url: selfieUrl,
      doctype: selfie?.type,
    },
  ].filter(({ url }) => !!url);

  // Images
  const images =
    documents?.map(({ url: imageUrl, doctype: caption }) => ({
      imageUrl,
      caption: camelCaseToSpace(caption)?.replace('id', 'ID'),
    })) ?? [];

  const selectedEndUser = {
    id: endUserId,
    fullName,
    avatarUrl,
  };
  const faceAUrl = images?.find(({ caption }) => /selfie/i.test(caption))?.imageUrl;
  const faceBUrl = images?.find(({ caption }) =>
    /id\scard|passport|driver\slicense/i.test(caption),
  )?.imageUrl;
  const whitelist = ['workflow', 'personalInfo', 'passportInfo', 'checkResults', 'addressInfo'];
  const camelCaseToTitle = (str: string) =>
    str?.replace(/([A-Z])/g, ' $1')?.replace(/^./, str => str?.toUpperCase());
  const octetToFileType = (base64: string, fileType: string) =>
    base64?.replace(/application\/octet-stream/gi, fileType);
  const info = {
    personalInfo,
    passportInfo,
    checkResults: { ...checkResults, finalResult: endUser?.approvalState },
    addressInfo,
    workflow: {
      name: underscoreToSpace(endUser?.workflow?.name),
      state: underscoreToSpace(endUser?.workflow?.workflowContext?.state),
    },
  };

  const task1 = [
    {
      type: 'heading',
      value: 'Lorem Ipsum',
    },
    {
      id: 'actions',
      type: 'container',
      value: [
        {
          type: 'callToAction',
          value: 'Options',
          data: {
            id: 'task1',
            approvalStatus: 'rejected',
          },
        },
        {
          type: 'callToAction',
          value: 'Approve',
          data: {
            id: 'task1',
            approvalStatus: 'approved',
          },
        },
      ],
    },
    {
      id: 'alerts',
      type: 'container',
      value: [
        {
          type: 'alert',
          value: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ',
        },
      ],
    },
    {
      type: 'container',
      value: [
        {
          type: 'faceComparison',
          value: {
            faceAUrl,
            faceBUrl,
          },
        },
        {
          type: 'details',
          value: {
            title: 'personalInfo',
            data: [
              {
                title: 'firstName',
                value: firstName,
              },
              {
                title: 'middleName',
                value: middleName,
              },
              {
                title: 'lastName',
                value: lastName,
              },
              {
                title: 'phone',
                value: phone,
              },
              {
                title: 'email',
                value: email,
              },
              {
                title: 'dateOfBirth',
                value: dateOfBirth,
              },
              {
                title: 'placeOfBirth',
                value: placeOfBirth,
              },
              {
                title: 'sex',
                value: sex,
              },
            ],
          },
        },
        {
          type: 'details',
          value: {
            title: 'passportInfo',
            data: [
              {
                title: 'type',
                value: passportInfo?.type,
              },
              {
                title: 'authority',
                value: passportInfo?.authority,
              },
              {
                title: 'placeOfIssue',
                value: passportInfo?.placeOfIssue,
              },
              {
                title: 'dateOfIssue',
                value: passportInfo?.dateOfIssue,
              },
              {
                title: 'expires',
                value: passportInfo?.expires,
              },
            ],
          },
        },
        {
          type: 'details',
          value: {
            title: 'checkResults',
            data: [
              {
                title: 'amlCheck',
                value: checkResults?.amlCheck,
              },
              {
                title: 'idCheck',
                value: checkResults?.idCheck,
              },
              {
                title: 'selfieCheck',
                value: checkResults?.selfieCheck,
              },
              {
                title: 'scannedBy',
                value: checkResults?.scannedBy,
              },
              {
                title: 'finalResult',
                value: checkResults?.finalResult,
              },
            ],
          },
        },
      ],
    },
    {
      type: 'multiDocuments',
      value: {
        data: [
          {
            title: id?.type,
            imageUrl: idUrl,
          },
          {
            title: selfie?.type,
            imageUrl: selfieUrl,
          },
        ],
      },
    },
  ];
  const task2 = [
    {
      id: 'actions',
      type: 'container',
      value: [
        {
          type: 'callToAction',
          value: 'Approve',
          data: {
            id: 'task2',
            approvalStatus: 'approved',
          },
        },
        {
          type: 'callToAction',
          value: 'Options',
          data: {
            id: 'task2',
            approvalStatus: 'rejected',
          },
        },
      ],
    },
    {
      type: 'container',
      value: [
        {
          type: 'details',
          value: {
            title: 'personalInfo',
            data: [
              {
                title: 'firstName',
                value: firstName,
              },
              {
                title: 'middleName',
                value: middleName,
              },
              {
                title: 'lastName',
                value: lastName,
              },
              {
                title: 'phone',
                value: phone,
              },
              {
                title: 'email',
                value: email,
              },
              {
                title: 'dateOfBirth',
                value: dateOfBirth,
              },
              {
                title: 'placeOfBirth',
                value: placeOfBirth,
              },
              {
                title: 'sex',
                value: sex,
              },
            ],
          },
        },
      ],
    },
    {
      type: 'multiDocuments',
      value: {
        data: [
          {
            title: id?.type,
            fileType: id?.fileType,
            imageUrl: idUrl,
          },
          {
            title: selfie?.type,
            fileType: selfie?.fileType,
            imageUrl: selfieUrl,
          },
          {
            title: camelCaseToTitle(certificateOfIncorporation?.type),
            fileType: certificateOfIncorporation?.fileType,
            imageUrl: octetToFileType(
              certificateOfIncorporationUrl,
              certificateOfIncorporation?.fileType,
            ),
          },
        ],
      },
    },
  ];
  const task3 = [
    {
      id: 'actions',
      type: 'container',
      value: [
        {
          type: 'callToAction',
          value: 'Approve',
          data: {
            id: 'task3',
            approvalStatus: 'approved',
          },
        },
        {
          type: 'callToAction',
          value: 'Options',
          data: {
            id: 'task3',
            approvalStatus: 'rejected',
          },
        },
      ],
    },
    {
      type: 'container',
      value: [
        {
          type: 'faceComparison',
          value: {
            faceAUrl,
            faceBUrl,
          },
        },
        {
          type: 'details',
          value: {
            title: 'personalInfo',
            data: [
              {
                title: 'firstName',
                value: firstName,
              },
              {
                title: 'middleName',
                value: middleName,
              },
              {
                title: 'lastName',
                value: lastName,
              },
              {
                title: 'phone',
                value: phone,
              },
              {
                title: 'email',
                value: email,
              },
              {
                title: 'dateOfBirth',
                value: dateOfBirth,
              },
              {
                title: 'placeOfBirth',
                value: placeOfBirth,
              },
              {
                title: 'sex',
                value: sex,
              },
            ],
          },
        },
        {
          type: 'details',
          value: {
            title: 'passportInfo',
            data: [
              {
                title: 'type',
                value: passportInfo?.type,
              },
              {
                title: 'authority',
                value: passportInfo?.authority,
              },
              {
                title: 'placeOfIssue',
                value: passportInfo?.placeOfIssue,
              },
              {
                title: 'dateOfIssue',
                value: passportInfo?.dateOfIssue,
              },
              {
                title: 'expires',
                value: passportInfo?.expires,
              },
            ],
          },
        },
        {
          type: 'details',
          value: {
            title: 'checkResults',
            data: [
              {
                title: 'amlCheck',
                value: checkResults?.amlCheck,
              },
              {
                title: 'idCheck',
                value: checkResults?.idCheck,
              },
              {
                title: 'selfieCheck',
                value: checkResults?.selfieCheck,
              },
              {
                title: 'scannedBy',
                value: checkResults?.scannedBy,
              },
              {
                title: 'finalResult',
                value: checkResults?.finalResult,
              },
            ],
          },
        },
      ],
    },
    {
      type: 'multiDocuments',
      value: {
        data: [
          {
            title: id?.type,
            imageUrl: idUrl,
          },
          {
            title: selfie?.type,
            imageUrl: selfieUrl,
          },
        ],
      },
    },
  ];
  const task4 = [
    {
      id: 'actions',
      type: 'container',
      value: [
        {
          type: 'callToAction',
          value: 'Options',
          data: {
            id: 'task4',
            approvalStatus: 'rejected',
          },
        },
        {
          type: 'callToAction',
          value: 'Approve',
          data: {
            id: 'task4',
            approvalStatus: 'approved',
          },
        },
      ],
    },
    {
      type: 'faceComparison',
      value: {
        faceAUrl,
        faceBUrl,
      },
    },
    {
      type: 'multiDocuments',
      value: {
        data: [
          {
            title: id?.type,
            imageUrl: idUrl,
          },
          {
            title: selfie?.type,
            imageUrl: selfieUrl,
          },
        ],
      },
    },
  ];
  const tasks = [task1, task2, task3, task4];
  const { mutate: mutateUpdateWorkflowById, isLoading: isLoadingUpdateWorkflowById } =
    useUpdateWorkflowByIdMutation({
      workflowId: endUser?.workflow?.runtimeDataId,
    });
  const onMutateUpdateWorkflowById =
    ({ id, approvalStatus }: { id: string; approvalStatus: 'rejected' | 'approved' }) =>
    () => {
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
          {value?.map(cell => components[cell.type]?.(cell))}
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
      const data = {
        [value.title]: value.data?.reduce((acc, curr) => {
          acc[curr.title] = curr.value;

          return acc;
        }, {}),
      };

      return (
        <div className={`m-2 rounded border border-slate-300 p-1`}>
          <Subject.Info info={data} whitelist={whitelist} isLoading={isLoading} />
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

  return {
    selectedEndUser,
    components,
    tasks,
  };
};
