import { TWorkflowById } from '../../../../domains/workflows/fetchers';
import { useAuthenticatedUserQuery } from '../../../../domains/auth/hooks/queries/useAuthenticatedUserQuery/useAuthenticatedUserQuery';
import { useCaseState } from '../../components/Case/hooks/useCaseState/useCaseState';
import { useStorageFilesQuery } from '../../../../domains/storage/hooks/queries/useStorageFilesQuery/useStorageFilesQuery';
import { getAddressDeep } from '../useEntity/utils/get-address-deep/get-address-deep';
import {
  composePickableCategoryType,
  convertSnakeCaseToTitleCase,
  extractCountryCodeFromWorkflow,
  getIsEditable,
  isExistingSchemaForDocument,
  omitPropsFromObject,
} from '../useEntity/utils';
import { getDocumentsByCountry, isObject } from '@ballerine/common';
import { useMemo } from 'react';
import { toStartCase } from '../../../../common/utils/to-start-case/to-start-case';

import { octetToFileType } from '../../../../common/octet-to-file-type/octet-to-file-type';
import { useCaseDecision } from '../../components/Case/hooks/useCaseDecision/useCaseDecision';

export const useTasks = ({
  workflow,
  entity,
  pluginsOutput,
  documents,
  parentMachine,
}: {
  workflow: TWorkflowById;
  entity: TWorkflowById['context']['entity'];
  pluginsOutput: TWorkflowById['context']['pluginsOutput'];
  documents: TWorkflowById['context']['documents'];
  parentMachine: TWorkflowById['context']['parentMachine'];
}) => {
  const { data: session } = useAuthenticatedUserQuery();
  const caseState = useCaseState(session?.user, workflow);
  const docsData = useStorageFilesQuery(
    workflow?.context?.documents?.flatMap(({ pages }) =>
      pages?.map(({ ballerineFileId }) => ballerineFileId),
    ),
  );
  const { noAction } = useCaseDecision();

  const results: Array<Array<string>> = [];
  workflow?.context?.documents?.forEach((document, docIndex) => {
    document?.pages?.forEach((page, pageIndex: number) => {
      if (!results[docIndex]) {
        results[docIndex] = [];
      }
      results[docIndex][pageIndex] = docsData?.shift()?.data;
    });
  });
  const pluginsOutputKeys = Object.keys(pluginsOutput ?? {});
  const address = getAddressDeep(pluginsOutput);
  const issuerCountryCode = extractCountryCodeFromWorkflow(workflow);
  const documentsSchemas = !!issuerCountryCode && getDocumentsByCountry(issuerCountryCode);

  return useMemo(() => {
    return entity
      ? [
          ...(Object.keys(pluginsOutput ?? {}).length === 0
            ? []
            : pluginsOutputKeys
                ?.filter(key => !!Object.keys(pluginsOutput[key] ?? {})?.length)
                ?.map(key => [
                  {
                    id: 'nested-details-heading',
                    type: 'heading',
                    value: 'Registry information',
                  },
                  {
                    type: 'details',
                    value: {
                      data: Object.entries(pluginsOutput[key] ?? {})?.map(([title, value]) => ({
                        title,
                        value,
                      })),
                    },
                  },
                ])),
          ...(documents?.map(
            (
              { id, type: docType, category, issuer, properties, propertiesSchema, decision },
              docIndex,
            ) => {
              const additionProperties =
                isExistingSchemaForDocument(documentsSchemas) &&
                composePickableCategoryType(category, docType, documentsSchemas);
              const isDoneWithRevision =
                decision?.status === 'revision' && parentMachine?.status === 'completed';

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
                            disabled:
                              (!isDoneWithRevision && Boolean(decision?.status)) || noAction,
                            decision: 'reject',
                          },
                        },
                        {
                          type: 'callToAction',
                          value: 'Approve',
                          data: {
                            id,
                            disabled:
                              (!isDoneWithRevision && Boolean(decision?.status)) || noAction,
                            decision: 'approve',
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
                      documents?.[docIndex]?.pages?.map(({ type, metadata, data }, pageIndex) => ({
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
                      })) ?? [],
                  },
                },
              ];
            },
          ) ?? []),
          Object.keys(entity?.data ?? {}).length === 0
            ? []
            : [
                {
                  type: 'heading',
                  value: `${toStartCase(entity?.type)} Information`,
                },
                {
                  id: 'entity-details',
                  type: 'details',
                  value: {
                    title: `${toStartCase(entity?.type)} Information`,
                    data: [
                      ...Object.entries(
                        omitPropsFromObject(entity?.data, 'additionalInfo', 'address') ?? {},
                      ),
                      ...Object.entries(entity?.data?.additionalInfo ?? {}),
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
                      id: 'header',
                      type: 'heading',
                      value: `${toStartCase(entity?.type)} Address`,
                    },
                    {
                      type: 'details',
                      value: {
                        title: `${toStartCase(entity?.type)} Address`,
                        data: !isObject(address)
                          ? [
                              {
                                title: 'Address',
                                value: address,
                                isEditable: false,
                              },
                            ]
                          : Object.entries(address ?? {})?.map(([title, value]) => ({
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
  }, [
    address,
    caseState.writeEnabled,
    docsData,
    documents,
    documentsSchemas,
    entity,
    parentMachine?.status,
    pluginsOutput,
    pluginsOutputKeys,
    results,
  ]);
};
