import { useParams } from '@tanstack/react-router';
import { useEntityWithWorkflowQuery } from '../../../../domains/entities/hooks/queries/useEntityWithWorkflowQuery/useEntityWithWorkflowQuery';
import { useStorageFilesQuery } from '../../../../domains/storage/hooks/queries/useStorageFilesQuery/useStorageFilesQuery';
import { useFilterEntity } from '../../../../domains/entities/hooks/useFilterEntity/useFilterEntity';
import { useUpdateWorkflowByIdMutation } from '../../../../domains/workflows/hooks/mutations/useUpdateWorkflowByIdMutation/useUpdateWorkflowByIdMutation';
import { useCaseState } from '../../components/Case/hooks/useCaseState/useCaseState';
import { useAuthenticatedUserQuery } from '../../../../domains/auth/hooks/queries/useAuthenticatedUserQuery/useAuthenticatedUserQuery';
import { toStartCase } from '../../../../common/utils/to-start-case/to-start-case';
import { components } from './components';

export const useEntity = () => {
  const { entityId } = useParams();
  const { data: entity, isLoading } = useEntityWithWorkflowQuery(entityId);
  const docsData = useStorageFilesQuery(
    entity?.workflow?.workflowContext?.machineContext?.documents?.flatMap(({ pages }) =>
      pages?.map(({ ballerineFileId }) => ballerineFileId),
    ),
  );

  const results = [];
  entity?.workflow?.workflowContext?.machineContext?.documents.forEach((document, docIndex) => {
    document?.pages.forEach((page, pageIndex) => {
      if (!results[docIndex]) {
        results[docIndex] = [];
      }
      results[docIndex][pageIndex] = docsData.shift().data;
    });
  });
  const filterEntity = useFilterEntity();
  const selectedEntity = {
    id: entityId,
    fullName: filterEntity === 'individuals' ? entity?.fullName : entity?.companyName,
    avatarUrl: entity?.avatarUrl,
    workflow: entity?.workflow,
  };
  const octetToFileType = (base64: string, fileType: string) =>
    base64?.replace(/application\/octet-stream/gi, fileType);
  const { mutate: mutateUpdateWorkflowById, isLoading: isLoadingUpdateWorkflowById } =
    useUpdateWorkflowByIdMutation({
      workflowId: entity?.workflow?.runtimeDataId,
    });
  const { data: session } = useAuthenticatedUserQuery();
  const caseState = useCaseState(session?.user, entity?.workflow);
  const contextEntity = entity?.workflow?.workflowContext?.machineContext?.entity;
  const contextDocuments = entity?.workflow?.workflowContext?.machineContext?.documents;
  const tasks = contextEntity
    ? [
        ...(contextDocuments?.map(
          ({ id, type, category, issuer, properties, propertiesSchema, decision }, docIndex) => {
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
                  isLoading: docsData?.some(({ isLoading }) => isLoading),
                  data:
                    contextDocuments?.[docIndex]?.pages?.map(
                      ({ type, metadata, data }, pageIndex) => ({
                        title: metadata?.side ? `${category} ${metadata?.side}` : category,
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
  };
};
