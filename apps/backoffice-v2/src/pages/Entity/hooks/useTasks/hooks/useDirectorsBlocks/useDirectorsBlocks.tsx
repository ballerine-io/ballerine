import { getDocumentsByCountry, StateTag } from '@ballerine/common';
import { AnyObject } from '@ballerine/ui';
import { UseQueryResult } from '@tanstack/react-query';
import React, { useMemo } from 'react';
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
import { getPostRemoveDecisionEventName } from '../../get-post-remove-decision-event-name';
import { motionProps } from '../../motion-props';
import { getRevisionReasonsForDocument } from '@/pages/Entity/hooks/useTasks/hooks/useDirectorsBlocks/helpers';
import { X } from 'lucide-react';

export type Director = AnyObject;

export const useDirectorsBlocks = (
  workflow: TWorkflowById,
  documentFiles: UseQueryResult[],
  documentImages: Array<Array<string>>,
) => {
  const { mutate: removeDecisionById } = useRemoveDecisionTaskByIdMutation(
    workflow.id,
    getPostRemoveDecisionEventName(workflow),
  );

  const { data: session } = useAuthenticatedUserQuery();
  const caseState = useCaseState(session?.user, workflow);
  const { noAction } = useCaseDecision();

  const directors = useMemo(
    () => (workflow?.context?.entity?.data?.additionalInfo?.directors as Director[]) || [],
    [workflow],
  );

  const documentSchemas = useMemo(() => {
    const issuerCountryCode = extractCountryCodeFromWorkflow(workflow);
    const documentsSchemas = issuerCountryCode ? getDocumentsByCountry(issuerCountryCode) : [];

    if (!Array.isArray(documentsSchemas) || !documentsSchemas.length) {
      console.warn(`No document schema found for issuer country code of "${issuerCountryCode}".`);
    }

    return documentsSchemas;
  }, [workflow]);

  const blocks = useMemo(() => {
    return directors
      .filter(director => Array.isArray(director.additionalInfo?.documents))
      .map(director => {
        const { documents } = director.additionalInfo;

        const multiDocumentsBlocks = documents.map((document: AnyObject, docIndex: number) => {
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
            workflowId: workflow?.id,
            documents,
          };

          const isApproved = document?.decision?.status === 'approved';
          const isRevision = document?.decision?.status === 'revision';

          const pendingReUploadBadge = {
            type: 'badge',
            value: <React.Fragment>Pending re-upload</React.Fragment>,
            props: {
              ...motionProps,
              variant: 'warning',
              className: 'min-h-8 text-sm font-bold',
            },
          };

          const reUploadedNeededBadge = {
            type: 'badge',
            value: (
              <React.Fragment>
                Re-upload needed
                <X
                  className="h-4 w-4 cursor-pointer"
                  onClick={() =>
                    removeDecisionById({
                      documentId: document.id,
                      contextUpdateMethod: 'director',
                    })
                  }
                />
              </React.Fragment>
            ),
            props: {
              ...motionProps,
              variant: 'warning',
              className: `gap-x-1 min-h-8 text-white bg-warning text-sm font-bold`,
            },
          };

          const reUploadNeededButton = {
            type: 'callToActionLegacy',
            value: {
              text: 'Re-upload needed',
              props: {
                revisionReasons: getRevisionReasonsForDocument(document, workflow),
                disabled: (!isDoneWithRevision && Boolean(document.decision?.status)) || noAction,
                decision: 'reject',
                id: document.id,
                contextUpdateMethod: 'director',
              },
            },
          };

          const approvedBadge = {
            type: 'badge',
            value: 'Approved',
            props: {
              ...motionProps,
              variant: 'success',
              className: `text-sm min-h-8 font-bold bg-success/20`,
            },
          };

          const approveButton = {
            type: 'callToActionLegacy',
            value: {
              text: 'Approve',
              props: {
                decision: 'approve',
                id: document.id,
                contextUpdateMethod: 'director',
                disabled: (!isDoneWithRevision && Boolean(document?.decision?.status)) || noAction,
              },
            },
          };

          const documentHeading = [];

          // Re-upload blocks start
          if (isRevision) {
            if (workflow?.tags?.includes(StateTag.REVISION)) {
              documentHeading.push(pendingReUploadBadge);
            } else {
              documentHeading.push(reUploadedNeededBadge);
            }
          }

          if (!isApproved && !isRevision) {
            documentHeading.push(reUploadNeededButton);
          }
          // Re-upload blocks end

          // Approve blocks start
          if (isApproved) {
            documentHeading.push(approvedBadge);
          } else {
            if (!isRevision) {
              documentHeading.push(approveButton);
            }
          }
          // Approve blocks end

          return {
            type: 'container',
            value: [
              {
                id: 'actions',
                type: 'container',
                props: {
                  className: 'mt-0',
                },
                value: documentHeading,
              },
              {
                id: 'header',
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
                        type: 'details',
                        value: {
                          id: document.id,
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
                              const isEditable = isDoneWithRevision || !document?.decision?.status;

                              return {
                                title,
                                value: fieldValue,
                                type,
                                format,
                                pattern,
                                dropdownOptions,
                                isEditable: isEditable && caseState.writeEnabled,
                                minimum: formatMinimum,
                                maximum: formatMaximum,
                              };
                            },
                          ),
                        },
                        documents,
                        workflowId: workflow?.id,
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
    workflow,
    caseState.writeEnabled,
    documentSchemas,
    noAction,
    removeDecisionById,
  ]);

  return blocks;
};
