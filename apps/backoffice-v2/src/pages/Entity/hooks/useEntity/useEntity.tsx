import { useParams } from 'react-router-dom';
import { useStorageFilesQuery } from '../../../../domains/storage/hooks/queries/useStorageFilesQuery/useStorageFilesQuery';
import { useCaseState } from '../../components/Case/hooks/useCaseState/useCaseState';
import { useAuthenticatedUserQuery } from '../../../../domains/auth/hooks/queries/useAuthenticatedUserQuery/useAuthenticatedUserQuery';
import { toStartCase } from '../../../../common/utils/to-start-case/to-start-case';
import { cells } from './cells';
import { useFilterId } from '../../../../common/hooks/useFilterId/useFilterId';
import { useWorkflowQuery } from '../../../../domains/workflows/hooks/queries/useWorkflowQuery/useWorkflowQuery';
import {
  composePickableCategoryType,
  convertSnakeCaseToTitleCase,
  extractCountryCodeFromWorkflow,
  getIsEditable,
  isExistingSchemaForDocument,
  omitPropsFromObject,
} from './utils';
import { getDocumentsByCountry } from '@ballerine/common';
import { getAddressDeep } from './utils/get-address-deep/get-address-deep';

export const useEntity = (websocketConnectionIsOpen: boolean) => {
  const { entityId } = useParams();
  const filterId = useFilterId();

  const { data: workflow, isLoading } = useWorkflowQuery({
    workflowId: entityId,
    filterId,
    websocketConnectionIsOpen,
  });
  const docsData = useStorageFilesQuery(
    workflow?.context?.documents?.flatMap(({ pages }) =>
      pages?.map(({ ballerineFileId }) => ballerineFileId),
    ),
    websocketConnectionIsOpen,
  );

  const results = [];
  workflow?.context?.documents?.forEach((document, docIndex) => {
    document?.pages.forEach((page, pageIndex) => {
      if (!results[docIndex]) {
        results[docIndex] = [];
      }
      results[docIndex][pageIndex] = docsData.shift().data;
    });
  });
  const selectedEntity = workflow?.entity;
  const issuerCountryCode = extractCountryCodeFromWorkflow(workflow);
  const documentsSchemas = !!issuerCountryCode && getDocumentsByCountry(issuerCountryCode);
  const octetToFileType = (base64: string, fileType: string) =>
    base64?.replace(/application\/octet-stream/gi, fileType);
  const { data: session } = useAuthenticatedUserQuery();
  const caseState = useCaseState(session?.user, workflow);
  const {
    documents: contextDocuments,
    entity: contextEntity,
    pluginsOutput,
  } = workflow?.context ?? {};
  const pluginsOutputKeys = Object.keys(pluginsOutput ?? {});
  const address = getAddressDeep(pluginsOutput);
  const tasks = contextEntity
    ? [
        ...(Object.keys(pluginsOutput ?? {}).length === 0
          ? []
          : pluginsOutputKeys
              ?.filter(key => !!Object.keys(pluginsOutput[key] ?? {})?.length)
              ?.map(key => [
                {
                  id: 'nested-details-heading',
                  type: 'heading',
                  value: convertSnakeCaseToTitleCase(key),
                },
                {
                  type: 'nestedDetails',
                  value: {
                    data: Object.entries(pluginsOutput[key] ?? {})?.map(([title, value]) => ({
                      title,
                      value,
                    })),
                  },
                },
              ])),
        ...(contextDocuments?.map(
          (
            { id, type: docType, category, issuer, properties, propertiesSchema, decision },
            docIndex,
          ) => {
            const additionProperties =
              isExistingSchemaForDocument(documentsSchemas) &&
              composePickableCategoryType(category, docType, documentsSchemas);
            const isDoneWithRevision =
              decision?.status === 'revision' &&
              workflow?.context?.parentMachine?.status === 'completed';

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
                          disabled: !isDoneWithRevision && Boolean(decision?.status),
                          approvalStatus: 'rejected',
                        },
                      },
                      {
                        type: 'callToAction',
                        value: 'Approve',
                        data: {
                          id,
                          disabled: !isDoneWithRevision && Boolean(decision?.status),
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
                      data: Object.entries(
                        {
                          ...additionProperties,
                          ...propertiesSchema?.properties,
                        } ?? {},
                      )?.map(
                        ([
                          title,
                          { type, format, pattern, isEditable = true, dropdownOptions, value },
                        ]) => {
                          const fieldValue = value || (properties?.[title] ?? '');
                          const isEditableDecision = isDoneWithRevision || !decision?.status;

                          return {
                            title,
                            value: fieldValue,
                            type,
                            format,
                            pattern,
                            isEditable:
                              isEditableDecision &&
                              caseState.writeEnabled &&
                              getIsEditable(isEditable, title),
                            dropdownOptions,
                          };
                        },
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
                        title: `${convertSnakeCaseToTitleCase(
                          category,
                        )} - ${convertSnakeCaseToTitleCase(docType)}${
                          metadata?.side ? ` - ${metadata?.side}` : ''
                        }`,
                        imageUrl:
                          type === 'pdf'
                            ? octetToFileType(results[docIndex][pageIndex], `application/${type}`)
                            : results[docIndex][pageIndex],
                        fileType: type,
                      }),
                    ) ?? [],
                },
              },
            ];
          },
        ) ?? []),
        Object.keys(contextEntity?.data ?? {}).length === 0
          ? []
          : [
              {
                type: 'heading',
                value: `${toStartCase(contextEntity?.type)} Information`,
              },
              {
                id: 'entity-details',
                type: 'details',
                value: {
                  title: `${toStartCase(contextEntity?.type)} Information`,
                  data: [
                    ...Object.entries(
                      omitPropsFromObject(contextEntity?.data, 'additionalInfo', 'address') ?? {},
                    ),
                    ...Object.entries(contextEntity?.data?.additionalInfo ?? {}),
                  ]?.map(([title, value]) => ({
                    title,
                    value,
                    type: 'string',
                    isEditable: false,
                  })),
                },
              },
            ],
        Object.keys(address ?? {})?.length === 0
          ? []
          : [
              {
                id: 'map-container',
                type: 'container',
                value: [
                  {
                    id: 'map-header',
                    type: 'heading',
                    value: `${toStartCase(contextEntity?.type)} Address`,
                  },
                  {
                    type: 'details',
                    value: {
                      title: `${toStartCase(contextEntity?.type)} Address`,
                      data: Object.entries(address ?? {})?.map(([title, value]) => ({
                        title,
                        value,
                        isEditable: false,
                      })),
                    },
                  },
                  {
                    type: 'map',
                    value: address,
                  },
                ],
              },
            ],
      ]
    : [];

  return {
    selectedEntity,
    cells,
    tasks,
    workflow,
    isLoading,
  };
};
