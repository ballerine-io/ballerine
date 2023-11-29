import { StateTag, getDocumentsByCountry } from '@ballerine/common';
import { AnyObject } from '@ballerine/ui';
import { UseQueryResult } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { toTitleCase } from 'string-ts';
import { ctw } from '../../../../../../common/utils/ctw/ctw';
import { valueOrNA } from '../../../../../../common/utils/value-or-na/value-or-na';
import { useAuthenticatedUserQuery } from '../../../../../../domains/auth/hooks/queries/useAuthenticatedUserQuery/useAuthenticatedUserQuery';
import { useRemoveDecisionTaskByIdMutation } from '../../../../../../domains/entities/hooks/mutations/useRemoveDecisionTaskByIdMutation/useRemoveDecisionTaskByIdMutation';
import { TWorkflowById } from '../../../../../../domains/workflows/fetchers';
import { useCaseDecision } from '../../../../../../pages/Entity/components/Case/hooks/useCaseDecision/useCaseDecision';
import { useCaseState } from '../../../../../../pages/Entity/components/Case/hooks/useCaseState/useCaseState';
import {
  composePickableCategoryType,
  extractCountryCodeFromWorkflow,
} from '../../../useEntity/utils';
import { getPostUpdateEventName } from '../../get-post-update-event-name';
import { motionProps } from '../../motion-props';
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

  const { data: session } = useAuthenticatedUserQuery();
  const caseState = useCaseState(session?.user, workflow);
  const { noAction } = useCaseDecision();

  const directors = useMemo(
    () => (workflow?.context?.entity?.data?.additionalInfo?.directors as Director[]) || [],
    [workflow],
  );
  const documents = useMemo(() => selectDirectorsDocuments(workflow), [workflow]);

  const documentSchemas = useMemo(() => {
    const issuerCountryCode = extractCountryCodeFromWorkflow(workflow);
    const documentsSchemas = issuerCountryCode ? getDocumentsByCountry(issuerCountryCode) : [];

    return documentsSchemas;
  }, [workflow]);

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
          const isDoneWithRevision = document?.decision?.status === 'revised';
          const additionalProperties = composePickableCategoryType(
            document.category,
            document.type,
            documentSchemas,
          );

          const decisionCell = {
            type: 'details',
            value: {
              id: document.id,
              title: 'Decision',
              hideSeparator: true,
              data: document?.decision?.status
                ? Object.entries(document?.decision ?? {}).map(([title, value]) => ({
                    title,
                    value,
                  }))
                : [],
            },
          };

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
                  document?.decision?.status === 'approved'
                    ? {
                        type: 'badge',
                        value: 'Approved',
                        props: {
                          ...motionProps,
                          variant: 'success',
                          className: `text-sm font-bold bg-success/20`,
                        },
                      }
                    : {
                        type: 'directorsCallToAction',
                        value: {
                          text: 'Approve',
                          props: {
                            documents,
                            decision: 'approve',
                            id: document.id,
                            disabled:
                              (!isDoneWithRevision && Boolean(document?.decision?.status)) ||
                              noAction,
                          },
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
                                dropdownOptions,
                                value,
                                formatMinimum,
                                formatMaximum,
                              },
                            ]) => {
                              const fieldValue = value || (document.properties?.[title] ?? '');
                              const isDoneWithRevision = document?.decision?.status === 'revised';
                              const isEditableDecision =
                                isDoneWithRevision || !document?.decision?.status;

                              return {
                                title,
                                value: fieldValue,
                                type,
                                format,
                                pattern,
                                dropdownOptions,
                                isEditable: isEditableDecision && caseState.writeEnabled,
                                minimum: formatMinimum,
                                maximum: formatMaximum,
                              };
                            },
                          ),
                        },
                        documents,
                        contextUpdateMethod: 'director',
                      },
                      decisionCell,
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

        const isDocumentRevision = documents.some(
          document => document?.decision?.status === 'revision',
        );

        return {
          className: ctw({
            'shadow-[0_4px_4px_0_rgba(174,174,174,0.0625)] border-[1px] border-warning':
              isDocumentRevision,
            'bg-warning/10': isDocumentRevision && !workflow?.tags?.includes(StateTag.REVISION),
          }),
          cells: [
            {
              type: 'container',
              value: [
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
                          value: {
                            text: 'Re-upload needed',
                            props: {
                              documents,
                              workflow,
                              onReset: handleRevisionDecisionsReset,
                            },
                          },

                          // 'Reject' displays the dialog with both "block" and "ask for re-upload" options
                        },
                        ...(workflow?.tags?.includes(StateTag.REVISION)
                          ? [
                              {
                                type: 'badge',
                                value: 'Pending re-upload',
                                props: {
                                  ...motionProps,
                                  variant: 'warning',
                                  className: 'text-sm font-bold',
                                },
                              },
                            ]
                          : []),
                      ],
                    },
                  ],
                },
                ...multiDocumentsBlocks,
              ],
            },
          ],
        };
      });
  }, [
    directors,
    documentFiles,
    documentImages,
    handleRevisionDecisionsReset,
    workflow,
    caseState.writeEnabled,
  ]);

  return blocks;
};
