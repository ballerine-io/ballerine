import { AnyObject } from '@ballerine/ui';
import { UseQueryResult } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { toTitleCase } from 'string-ts';
import { valueOrNA } from '../../../../../../common/utils/value-or-na/value-or-na';
import { TWorkflowById } from '../../../../../../domains/workflows/fetchers';
import { composePickableCategoryType } from '../../../useEntity/utils';
import { useRemoveDecisionTaskByIdMutation } from '../../../../../../domains/entities/hooks/mutations/useRemoveDecisionTaskByIdMutation/useRemoveDecisionTaskByIdMutation';
import { getPostUpdateEventName } from '../../get-post-update-event-name';
import { selectDirectorsDocuments } from '../../selectors/selectDirectorsDocuments';

export type Director = AnyObject;

export const useDirectorsBlocks = (
  workflow: TWorkflowById,
  documentFiles: UseQueryResult[],
  documentImages: Array<Array<string>>,
) => {
  const { mutate } = useRemoveDecisionTaskByIdMutation(
    workflow.id,
    getPostUpdateEventName(workflow),
  );

  const directors: Director[] = useMemo(
    () => (workflow?.context?.entity?.data?.additionalInfo?.directors as Director[]) || [],
    [workflow],
  );
  const documents = useMemo(() => selectDirectorsDocuments(workflow), [workflow]);

  const handleRevisionDecisionsReset = useCallback(() => {
    const documentsToReset = documents.filter(document => document.decision?.status);

    documentsToReset.forEach(document => {
      mutate({ documentId: document.id, contextUpdateMethod: 'director' });
    });
  }, []);

  const blocks = useMemo(() => {
    return directors
      .filter(director => Array.isArray(director.additionalInfo?.documents))
      .map(director => {
        const { documents } = director.additionalInfo;

        const multiDocumentsBlocks = documents.map((document, docIndex) => {
          const additionalProperties = composePickableCategoryType(
            document.category,
            document.type,
            documents,
          );

          return {
            type: 'container',
            value: [
              {
                id: 'actions',
                type: 'container',
                props: {
                  className: 'mt-0',
                },
                value: [
                  {
                    type: 'directorsCallToAction',
                    value: 'Approve',
                    documents,
                    data: {
                      id: document.id,

                      // disabled: (!isDoneWithRevision && Boolean(decision?.status)) || noAction,
                      decision: 'approve',
                    },
                  },
                ],
              },
              {
                id: 'kyc-block',
                type: 'container',
                value: [
                  {
                    type: 'container',
                    value: [
                      {
                        type: 'subheading',
                        value: `${valueOrNA(toTitleCase(document.category ?? ''))} - ${valueOrNA(
                          toTitleCase(document.type ?? ''),
                        )}`,
                      },
                      {
                        title: 'Details test',
                        type: 'details',
                        value: {
                          id: document.id,
                          title: 'Details test',
                          data: Object.entries(
                            {
                              ...additionalProperties,
                              ...document.propertiesSchema?.properties,
                            } ?? {},
                          )?.map(
                            ([
                              title,
                              {
                                type,
                                format,
                                pattern,
                                isEditable = true,
                                dropdownOptions,
                                value,
                                formatMinimum,
                                formatMaximum,
                              },
                            ]) => {
                              const fieldValue = value || (document.properties?.[title] ?? '');

                              return {
                                title,
                                value: fieldValue,
                                type,
                                format,
                                pattern,
                                dropdownOptions,
                                isEditable,
                                minimum: formatMinimum,
                                maximum: formatMaximum,
                              };
                            },
                          ),
                        },
                        documents,
                        contextUpdateMethod: 'director',
                      },
                    ],
                  },
                  {
                    type: 'container',
                    value: [
                      {
                        type: 'multiDocuments',
                        isLoading: documentFiles?.some(({ isLoading }) => isLoading),
                        value: {
                          data: document.pages.map(({ type, metadata }, pageIndex) => ({
                            title: `${valueOrNA(
                              toTitleCase(document.category ?? ''),
                            )} - ${valueOrNA(toTitleCase(document.type ?? ''))}${
                              metadata?.side ? ` - ${metadata?.side}` : ''
                            }`,
                            imageUrl: documentImages[docIndex][pageIndex],
                            fileType: type,
                          })),
                        },
                      },
                    ],
                  },
                ],
              },
            ],
          };
        });

        return {
          cells: [
            {
              id: 'header',
              type: 'container',
              value: [
                {
                  type: 'heading',
                  value: `Director - ${director.firstName} ${director.lastName}`,
                },
                {
                  id: 'actions',
                  type: 'container',
                  value: [
                    {
                      type: 'directorsCallToAction',
                      // 'Reject' displays the dialog with both "block" and "ask for re-upload" options
                      value: 'Re-upload needed',
                      documents,
                      workflow,
                      onReset: handleRevisionDecisionsReset,
                    },
                  ],
                },
              ],
            },
            ...multiDocumentsBlocks,
          ],
        };
      });
  }, [directors, documentFiles, documentImages, handleRevisionDecisionsReset, workflow]);

  return blocks;
};
