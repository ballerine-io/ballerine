import { useParams } from '@tanstack/react-router';
import { useEndUserWithWorkflowQuery } from '../../../../../lib/react-query/queries/useEndUserWithWorkflowQuery/useEndUserWithWorkflowQuery';
import React from 'react';
import { useUpdateWorkflowByIdMutation } from '../../../../../lib/react-query/mutations/useUpdateWorkflowByIdMutation/useUpdateWorkflowByIdMutation';
import { toStartCase } from '../../../../../utils/to-start-case/to-start-case';
import { useStorageFilesQuery } from '../../../../../lib/react-query/queries/useStorageFilesQuery/useStorageFilesQuery';
import { useCaseState } from 'components/organisms/Subject/hooks/useCaseState/useCaseState';
import { useGetSessionQuery } from '../../../../../lib/react-query/queries/useGetSessionQuery/useGetSessionQuery';
import { useFilterEntity } from 'hooks/useFilterEntity/useFilterEntity';
import { components } from 'components/pages/Individual/hooks/useIndividual/components';

export const useIndividual = () => {
  const { endUserId } = useParams();
  const { data: endUser, isLoading } = useEndUserWithWorkflowQuery(endUserId);
  const results = useStorageFilesQuery(
    endUser?.workflow?.workflowContext?.machineContext?.documents?.flatMap(({ pages }) =>
      pages?.map(({ ballerineFileId }) => ballerineFileId),
    ),
  );

  endUser?.workflow?.workflowContext?.machineContext?.documents.forEach(document => {
    document?.pages.forEach(page => {
      page.data = results.shift().data;
    });
  });

  const entity = useFilterEntity();
  const selectedEndUser = {
    id: endUserId,
    fullName: entity === 'individuals' ? endUser?.fullName : endUser?.companyName,
    avatarUrl: endUser?.avatarUrl,
    workflow: endUser?.workflow,
  };
  const octetToFileType = (base64: string, fileType: string) =>
    base64?.replace(/application\/octet-stream/gi, fileType);
  const { mutate: mutateUpdateWorkflowById, isLoading: isLoadingUpdateWorkflowById } =
    useUpdateWorkflowByIdMutation({
      workflowId: endUser?.workflow?.runtimeDataId,
    });
  const { data: session } = useGetSessionQuery();
  const caseState = useCaseState(session?.user, endUser?.workflow);
  const contextEntity = endUser?.workflow?.workflowContext?.machineContext?.entity;
  const contextDocuments = endUser?.workflow?.workflowContext?.machineContext?.documents;
  const tasks = contextEntity
    ? [
        ...(contextDocuments?.map(
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
                    contextDocuments?.[index]?.pages?.map(({ type, metadata, data }) => ({
                      title: metadata?.side ? `${category} ${metadata?.side}` : category,
                      imageUrl: type === 'pdf' ? octetToFileType(data, type) : data,
                      fileType: type,
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
              title: `${toStartCase(contextEntity?.type)} Information`,
              data: Object.entries(contextEntity?.data ?? {})?.map(([title, value]) => ({
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
