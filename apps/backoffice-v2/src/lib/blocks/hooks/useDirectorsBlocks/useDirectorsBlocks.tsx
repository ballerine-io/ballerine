import React, { useCallback, useMemo } from 'react';
import { getDocumentsByCountry, StateTag, TDocument } from '@ballerine/common';
import { Button, ctw } from '@ballerine/ui';
import { UseQueryResult } from '@tanstack/react-query';
import {
  composePickableCategoryType,
  extractCountryCodeFromWorkflow,
} from '@/pages/Entity/hooks/useEntityLogic/utils';
import { motionBadgeProps } from '../../motion-badge-props';
import { useApproveTaskByIdMutation } from '@/domains/entities/hooks/mutations/useApproveTaskByIdMutation/useApproveTaskByIdMutation';
import { useRemoveDecisionTaskByIdMutation } from '@/domains/entities/hooks/mutations/useRemoveDecisionTaskByIdMutation/useRemoveDecisionTaskByIdMutation';
import { useCaseState } from '@/pages/Entity/components/Case/hooks/useCaseState/useCaseState';
import { useAuthenticatedUserQuery } from '@/domains/auth/hooks/queries/useAuthenticatedUserQuery/useAuthenticatedUserQuery';
import { selectDirectorsDocuments } from '@/pages/Entity/selectors/selectDirectorsDocuments';
import { TWorkflowById } from '@/domains/workflows/fetchers';
import { useCaseDecision } from '@/pages/Entity/components/Case/hooks/useCaseDecision/useCaseDecision';
import { createBlocksTyped } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';
import { X } from 'lucide-react';
import { getRevisionReasonsForDocument } from '@/lib/blocks/components/DirectorsCallToAction/helpers';
import { valueOrNA } from '@/common/utils/value-or-na/value-or-na';
import { toTitleCase } from 'string-ts';
import { DecisionStatus, Director } from '@/lib/blocks/hooks/useDirectorsBlocks/types';
import { MotionButton } from '@/common/components/molecules/MotionButton/MotionButton';
import { motionButtonProps } from '@/lib/blocks/hooks/useAssosciatedCompaniesBlock/useAssociatedCompaniesBlock';

export const useDirectorsBlocks = ({
  workflow,
  documentFiles,
  documentImages,
  onReuploadNeeded,
}: {
  workflow: TWorkflowById;
  documentFiles: UseQueryResult[];
  documentImages: string[][];
  onReuploadNeeded: ({
    workflowId,
    documentId,
    reason,
  }: {
    workflowId: string;
    documentId: string;
    reason?: string;
  }) => () => void;
}) => {
  const { mutate: removeDecisionById } = useRemoveDecisionTaskByIdMutation(workflow?.id);

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

    if (!Array.isArray(documentsSchemas) || !documentsSchemas.length) {
      console.warn(`No document schema found for issuer country code of "${issuerCountryCode}".`);
    }

    return documentsSchemas;
  }, [workflow]);

  const handleRevisionDecisionsReset = useCallback(() => {
    const documentsToReset = documents.filter(document => document.decision?.status);

    documentsToReset.forEach(document => {
      removeDecisionById({ documentId: document.id, contextUpdateMethod: 'director' });
    });
  }, [documents, removeDecisionById]);

  const { mutate: mutateApproveTaskById, isLoading: isLoadingApproveTaskById } =
    useApproveTaskByIdMutation(workflow?.id);
  const onMutateApproveTaskById = useCallback(
    ({
        taskId,
        contextUpdateMethod,
      }: {
        taskId: string;
        contextUpdateMethod: 'base' | 'director';
      }) =>
      () =>
        mutateApproveTaskById({ documentId: taskId, contextUpdateMethod }),
    [mutateApproveTaskById],
  );

  const blocks = useMemo(() => {
    return directors
      .filter(director => Array.isArray(director.additionalInfo?.documents))
      .flatMap(director => {
        const { documents } = director.additionalInfo;
        const isDocumentRevision = documents.some(
          document => document?.decision?.status === 'revision',
        );
        const multiDocumentsBlocks = documents.flatMap((document: TDocument, docIndex) => {
          const isDoneWithRevision = document?.decision?.status === 'revised';
          const additionalProperties = composePickableCategoryType(
            document.category,
            document.type,
            documentSchemas,
          );

          const decisionCell = createBlocksTyped()
            .addBlock()
            .addCell({
              type: 'details',
              contextUpdateMethod: 'director',
              hideSeparator: true,
              value: {
                id: document.id,
                title: 'Decision',
                data: document?.decision?.status
                  ? Object.entries(document?.decision ?? {}).map(([title, value]) => ({
                      title,
                      value,
                    }))
                  : [],
              },
              workflowId: workflow?.id,
              documents,
            })
            .cellAt(0, 0);

          const getReuploadStatusOrAction = (
            decisionStatus: DecisionStatus,
            workflow: TWorkflowById,
          ) => {
            const isRevision = decisionStatus === 'revision';

            if (isRevision) {
              if (workflow?.tags?.includes(StateTag.REVISION)) {
                const pendingReUploadBlock = createBlocksTyped()
                  .addBlock()
                  .addCell({
                    type: 'badge',
                    value: <React.Fragment>Pending re-upload</React.Fragment>,
                    props: {
                      variant: 'warning',
                      className: 'min-h-8 text-sm font-bold',
                    },
                  })
                  .build()
                  .flat(1);

                return pendingReUploadBlock;
              } else {
                const reUploadNeededBlock = createBlocksTyped()
                  .addBlock()
                  .addCell({
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
                      variant: 'warning',
                      className: `gap-x-1 min-h-8 text-white bg-warning text-sm font-bold`,
                    },
                  })
                  .build()
                  .flat(1);

                return reUploadNeededBlock;
              }
            }

            return undefined;
          };

          const getReUploadedNeededAction = (
            decisionStatus: DecisionStatus,
            workflow: TWorkflowById,
          ) => {
            if (decisionStatus !== 'approved' && decisionStatus !== 'revision') {
              const reUploadNeededBlock = createBlocksTyped()
                .addBlock()
                .addCell({
                  type: 'callToActionLegacy',
                  value: {
                    text: 'Re-upload needed',
                    props: {
                      revisionReasons: getRevisionReasonsForDocument(document, workflow),
                      disabled:
                        (!isDoneWithRevision && Boolean(document.decision?.status)) || noAction,
                      decision: 'reject',
                      id: document.id,
                      contextUpdateMethod: 'director',
                      workflow,
                      onReuploadNeeded,
                    },
                  },
                })
                .build()
                .flat(1);

              return reUploadNeededBlock;
            }

            return undefined;
          };

          const getDecisionStatusOrAction = (
            decisionStatus: DecisionStatus,
            workflow: TWorkflowById,
          ) => {
            if (decisionStatus === 'approved') {
              const approvedBadgeBlock = createBlocksTyped()
                .addBlock()
                .addCell({
                  type: 'badge',
                  value: 'Approved',
                  props: {
                    ...motionBadgeProps,
                    variant: 'success',
                    className: `text-sm font-bold bg-success/20`,
                  },
                })
                .build()
                .flat(1);

              return approvedBadgeBlock;
            } else {
              if (decisionStatus !== 'revision') {
                const isApproveDisabled =
                  (!isDoneWithRevision && Boolean(document?.decision?.status)) ||
                  noAction ||
                  isLoadingApproveTaskById;
                const approveButtonBlock = createBlocksTyped()
                  .addBlock()
                  .addCell({
                    type: 'dialog',
                    value: {
                      trigger: (
                        <MotionButton
                          {...motionButtonProps}
                          animate={{
                            ...motionButtonProps.animate,
                            opacity: isApproveDisabled ? 0.5 : motionButtonProps.animate.opacity,
                          }}
                          disabled={isApproveDisabled}
                          size={'wide'}
                          variant={'success'}
                        >
                          Approve
                        </MotionButton>
                      ),
                      title: `Approval confirmation`,
                      description: <p className={`text-sm`}>Are you sure you want to approve?</p>,
                      close: (
                        <div className={`space-x-2`}>
                          <Button type={'button'} variant={`secondary`}>
                            Cancel
                          </Button>
                          <Button
                            disabled={isApproveDisabled}
                            onClick={onMutateApproveTaskById({
                              taskId: document.id,
                              contextUpdateMethod: 'director',
                            })}
                          >
                            Approve
                          </Button>
                        </div>
                      ),
                      props: {
                        content: {
                          className: 'mb-96',
                        },
                        title: {
                          className: `text-2xl`,
                        },
                      },
                    },
                  })
                  .build()
                  .flat(1);

                return approveButtonBlock;
              }
            }

            return undefined;
          };

          const documentHeading = [
            getReuploadStatusOrAction(document?.decision?.status, workflow),
            getReUploadedNeededAction(document?.decision?.status, workflow),
            getDecisionStatusOrAction(document?.decision?.status, workflow),
          ]
            .filter(Boolean)
            .map(block => block?.flat(1)[0]);

          return createBlocksTyped()
            .addBlock()
            .addCell({
              type: 'container',
              value: createBlocksTyped()
                .addBlock()
                .addCell({
                  id: 'actions',
                  type: 'container',
                  props: {
                    className: 'mt-0',
                  },
                  value: documentHeading,
                })
                .addCell({
                  id: 'header',
                  type: 'container',
                  props: {
                    className: 'items-start',
                  },
                  value: createBlocksTyped()
                    .addBlock()
                    .addCell({
                      type: 'container',
                      value: createBlocksTyped()
                        .addBlock()
                        .addCell({
                          type: 'subheading',
                          value: `${valueOrNA(toTitleCase(document.category ?? ''))} - ${valueOrNA(
                            toTitleCase(document.type ?? ''),
                          )}`,
                        })
                        .addCell({
                          type: 'details',
                          contextUpdateMethod: 'director',
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
                                const isEditable =
                                  isDoneWithRevision || !document?.decision?.status;

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
                        })
                        .addCell(decisionCell)
                        .build()
                        .flat(1),
                    })
                    .addCell({
                      type: 'container',
                      value: createBlocksTyped()
                        .addBlock()
                        .addCell({
                          type: 'multiDocuments',
                          isLoading: documentFiles?.some(({ isLoading }) => isLoading),
                          value: {
                            data:
                              document?.pages?.map(({ type, metadata }, pageIndex) => ({
                                title: `${valueOrNA(
                                  toTitleCase(document.category ?? ''),
                                )} - ${valueOrNA(toTitleCase(document.type ?? ''))}${
                                  metadata?.side ? ` - ${metadata?.side}` : ''
                                }`,
                                imageUrl: documentImages?.[docIndex]?.[pageIndex],
                                fileType: type,
                              })) ?? [],
                          },
                        })
                        .build()
                        .flat(1),
                    })
                    .build()
                    .flat(1),
                })
                .build()
                .flat(1),
            })
            .build()
            .flat(1);
        });

        return createBlocksTyped()
          .addBlock()
          .addCell({
            type: 'block',
            value: createBlocksTyped()
              .addBlock()
              .addCell({
                type: 'container',
                value: createBlocksTyped()
                  .addBlock()
                  .addCell({
                    type: 'heading',
                    value: `Director - ${director.firstName} ${director.lastName}`,
                  })
                  .build()
                  .flat(1),
              })
              .build()
              .concat(multiDocumentsBlocks)
              .flat(1),
            className: ctw({
              'shadow-[0_4px_4px_0_rgba(174,174,174,0.0625)] border-[1px] border-warning':
                isDocumentRevision,
              'bg-warning/10': isDocumentRevision && !workflow?.tags?.includes(StateTag.REVISION),
            }),
          })
          .build();
      });
  }, [
    directors,
    workflow,
    documentSchemas,
    documentFiles,
    onMutateApproveTaskById,
    noAction,
    isLoadingApproveTaskById,
    caseState.actionButtonsEnabled,
    caseState.writeEnabled,
    documentImages,
    handleRevisionDecisionsReset,
  ]);

  return blocks;
};
