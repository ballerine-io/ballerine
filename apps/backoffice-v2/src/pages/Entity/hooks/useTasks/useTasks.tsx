import { useBlocks } from '../useEntity/blocks';
import { getAddressDeep } from '../useEntity/utils/get-address-deep/get-address-deep';
import { useMemo } from 'react';
import {
  composePickableCategoryType,
  convertSnakeCaseToTitleCase,
  getIsEditable,
  isExistingSchemaForDocument,
  omitPropsFromObject,
} from '../useEntity/utils';
import { octetToFileType } from '../../../../common/utils/octet-to-file-type/octet-to-file-type';
import { toStartCase } from '../../../../common/utils/to-start-case/to-start-case';
import { useCaseState } from '../../components/Case/hooks/useCaseState/useCaseState';
import { TWorkflowById } from '../../../../domains/workflows/fetchers';
import { TDocument } from '@ballerine/common';
import { UseQueryResult } from '@tanstack/react-query';

export const useTasks = ({
  pluginsOutput,
  entity,
  documents,
  documentsSchemas,
  parentMachine,
  caseState,
  docsData,
  results,
}: {
  pluginsOutput: TWorkflowById['context']['pluginsOutput'];
  entity: TWorkflowById['context']['entity'];
  documents: TWorkflowById['context']['documents'];
  documentsSchemas: Array<TDocument>;
  parentMachine: TWorkflowById['context']['parentMachine'];
  caseState: ReturnType<typeof useCaseState>;
  docsData: UseQueryResult<string, unknown>[];
  results: Array<Record<string, unknown>>;
}) => {
  const blocks = useBlocks();
  const pluginsOutputKeys = Object.keys(pluginsOutput ?? {});
  const address = getAddressDeep(pluginsOutput);

  return useMemo(() => {
    let tasks = blocks;

    if (Object.keys(pluginsOutput ?? {}).length) {
      const nonEmptyPluginsOutputKeys = pluginsOutputKeys?.filter(
        key => !!Object.keys(pluginsOutput[key] ?? {})?.length,
      );

      nonEmptyPluginsOutputKeys?.forEach(key => {
        tasks = tasks
          .addBlock()
          .addCell({
            id: 'nested-details-heading',
            keyProp: 'key',
            key: `nested-details-heading:${key}`,
            type: 'heading',
            value: convertSnakeCaseToTitleCase(key),
          })
          .addCell({
            keyProp: 'key',
            key: `nested-details:${key}`,
            type: 'nestedDetails',
            value: {
              data: Object.entries(pluginsOutput[key] ?? {})?.map(([title, value]) => ({
                title,
                value,
              })),
            },
          });
      });
    }

    if (documents?.length) {
      documents?.forEach(
        (
          { id, type: docType, category, issuer, properties, propertiesSchema, decision },
          docIndex,
        ) => {
          const additionProperties =
            isExistingSchemaForDocument(documentsSchemas) &&
            composePickableCategoryType(category, docType, documentsSchemas);
          const isDoneWithRevision =
            decision?.status === 'revision' && parentMachine?.status === 'completed';

          tasks = tasks
            .addBlock()
            .addCell({
              id: 'header',
              type: 'container',
              keyProp: 'key',
              key: `header:container:${id}`,
              value: [
                {
                  type: 'heading',
                  value: `${convertSnakeCaseToTitleCase(category)} - ${convertSnakeCaseToTitleCase(
                    docType,
                  )}`,
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
            })
            .addCell({
              type: 'container',
              keyProp: 'key',
              key: `container:${id}`,
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
            })
            .addCell({
              type: 'multiDocuments',
              keyProp: 'key',
              key: `multiDocuments:${id}`,
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
            });
        },
      );
    }

    if (address) {
      tasks = tasks.addBlock().addCell({
        id: 'map-container',
        type: 'container',
        keyProp: 'key',
        key: `map-container:container:${entity?.id}}`,
        value: [
          {
            id: 'map-header',
            type: 'heading',
            value: `${toStartCase(entity?.type)} Address`,
          },
          {
            type: 'details',
            value: {
              title: `${toStartCase(entity?.type)} Address`,
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
      });
    }

    if (Object.keys(entity ?? {}).length) {
      tasks = tasks
        .addBlock()
        .addCell({
          type: 'heading',
          value: `${toStartCase(entity?.type)} Information`,
          keyProp: 'key',
          key: `heading:${entity?.id}`,
        })
        .addCell({
          id: 'entity-details',
          type: 'details',
          keyProp: 'key',
          key: `entity-details:details:${entity?.id}`,
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
        });
    }

    return tasks.build();
  }, [
    address,
    blocks,
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
