import { useParams } from 'react-router-dom';
import { useStorageFilesQuery } from '../../../../domains/storage/hooks/queries/useStorageFilesQuery/useStorageFilesQuery';
import { useFilterEntity } from '../../../../domains/entities/hooks/useFilterEntity/useFilterEntity';
import { useUpdateWorkflowByIdMutation } from '../../../../domains/workflows/hooks/mutations/useUpdateWorkflowByIdMutation/useUpdateWorkflowByIdMutation';
import { useCaseState } from '../../components/Case/hooks/useCaseState/useCaseState';
import { useAuthenticatedUserQuery } from '../../../../domains/auth/hooks/queries/useAuthenticatedUserQuery/useAuthenticatedUserQuery';
import { toStartCase } from '../../../../common/utils/to-start-case/to-start-case';
import { components } from './components';
import { useFilterId } from '../../../../common/hooks/useFilterId/useFilterId';
import { useWorkflowQuery } from '../../../../domains/workflows/hooks/queries/useWorkflowQuery/useWorkflowQuery';

const convertSnakeCaseToTitleCase = (input: string): string =>
  input
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

export const useEntity = () => {
  const { entityId } = useParams();
  const filterId = useFilterId();

  const { data: workflow, isLoading } = useWorkflowQuery({ workflowId: entityId, filterId });
  const docsData = useStorageFilesQuery(
    workflow.context.documents?.flatMap(({ pages }) =>
      pages?.map(({ ballerineFileId }) => ballerineFileId),
    ),
  );

  const results = [];
  workflow.context.documents?.forEach((document, docIndex) => {
    document?.pages.forEach((page, pageIndex) => {
      if (!results[docIndex]) {
        results[docIndex] = [];
      }
      results[docIndex][pageIndex] = docsData.shift().data;
    });
  });
  const selectedEntity = workflow.entity;
  const octetToFileType = (base64: string, fileType: string) =>
    base64?.replace(/application\/octet-stream/gi, fileType);
  const { mutate: mutateUpdateWorkflowById, isLoading: isLoadingUpdateWorkflowById } =
    useUpdateWorkflowByIdMutation({
      workflowId: workflow.id,
    });
  const { data: session } = useAuthenticatedUserQuery();
  const caseState = useCaseState(session?.user, workflow);
  const contextEntity = workflow.context.entity;
  const contextDocuments = workflow.context.documents;
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
                    value: `${convertSnakeCaseToTitleCase(
                      category,
                    )} - ${convertSnakeCaseToTitleCase(docType)}`,
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
                          disabled: Boolean(decision?.status),
                          approvalStatus: 'rejected',
                        },
                      },
                      {
                        type: 'callToAction',
                        value: 'Approve',
                        data: {
                          id,
                          disabled: Boolean(decision?.status),
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
    selectedEntity,
    components,
    tasks,
    workflow,
    isLoading,
  };
};
