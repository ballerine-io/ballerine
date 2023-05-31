import { useParams } from '@tanstack/react-router';
import { useEndUserWithWorkflowQuery } from '../../../../../lib/react-query/queries/useEndUserWithWorkflowQuery/useEndUserWithWorkflowQuery';
import { useUpdateWorkflowByIdMutation } from '../../../../../lib/react-query/mutations/useUpdateWorkflowByIdMutation/useUpdateWorkflowByIdMutation';
import { toStartCase } from '../../../../../utils/to-start-case/to-start-case';
import { useStorageFilesQuery } from '../../../../../lib/react-query/queries/useStorageFilesQuery/useStorageFilesQuery';
import { useCaseState } from 'components/organisms/Subject/hooks/useCaseState/useCaseState';
import { useGetSessionQuery } from '../../../../../lib/react-query/queries/useGetSessionQuery/useGetSessionQuery';
import { useFilterEntity } from 'hooks/useFilterEntity/useFilterEntity';
import { components } from 'components/pages/Individual/hooks/useIndividual/components';

const prettifyString = (input: string): string => {
  let words = input.split('_');
  words = words.map(word => word.charAt(0).toUpperCase() + word.slice(1));
  return words.join(' ');
};

export const useIndividual = () => {
  const { endUserId } = useParams();
  const { data: endUser, isLoading } = useEndUserWithWorkflowQuery(endUserId);
  const docsData = useStorageFilesQuery(
    endUser?.workflow?.workflowContext?.machineContext?.documents?.flatMap(({ pages }) =>
      pages?.map(({ ballerineFileId }) => ballerineFileId),
    ),
  );

  const results = [];
  endUser?.workflow?.workflowContext?.machineContext?.documents.forEach((document, docIndex) => {
    document?.pages.forEach((page, pageIndex) => {
      if (!results[docIndex]) {
        results[docIndex] = [];
      }
      results[docIndex][pageIndex] = docsData.shift().data;
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
          (
            { id, type: docType, category, issuer, properties, propertiesSchema, decision },
            docIndex,
          ) => {
            return [
              {
                id: 'header',
                type: 'container',
                value: [
                  {
                    type: 'heading',
                    value: `${prettifyString(category)} - ${prettifyString(docType)}`,
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
                      title: `${category} - ${docType}`,
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
                  isLoading: docsData?.some(({ isLoading }) => isLoading),
                  data:
                    contextDocuments?.[docIndex]?.pages?.map(
                      ({ type, metadata, data }, pageIndex) => ({
                        title: `${category} - ${docType}${
                          metadata?.side ? ` - ${metadata?.side}` : ''
                        }`,
                        imageUrl:
                          type === 'pdf'
                            ? octetToFileType(results[docIndex][pageIndex], type)
                            : results[docIndex][pageIndex],
                        fileType: type,
                      }),
                    ) ?? [],
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
