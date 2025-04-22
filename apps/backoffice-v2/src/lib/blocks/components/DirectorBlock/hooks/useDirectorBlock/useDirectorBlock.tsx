import { MotionButton } from '@/common/components/molecules/MotionButton/MotionButton';
import { StateTag, valueOrNA } from '@ballerine/common';
import { TWorkflowById } from '@/domains/workflows/fetchers';
import { getRevisionReasonsForDocument } from '@/lib/blocks/components/DirectorsCallToAction/helpers';
import { createBlocksTyped } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';
import { motionButtonProps } from '@/lib/blocks/hooks/useAssosciatedCompaniesBlock/useAssociatedCompaniesBlock';
import { useCaseDecision } from '@/pages/Entity/components/Case/hooks/useCaseDecision/useCaseDecision';
import { composePickableCategoryType } from '@/pages/Entity/hooks/useEntityLogic/utils';
import { Button, ctw } from '@ballerine/ui';
import { X } from 'lucide-react';
import React, { useMemo } from 'react';
import { titleCase } from 'string-ts';
import { DecisionStatus } from './types';
import { motionBadgeProps } from '@/lib/blocks/motion-badge-props';

export const useDirectorBlock = ({
  workflowId,
  onReuploadNeeded,
  onRemoveDecision,
  onApprove,
  director,
  tags,
  revisionReasons,
  isEditable: isEditable_,
  isApproveDisabled,
  documentSchemas,
  isLoadingDocuments,
  // Remove once callToActionLegacy is removed
  workflow,
}: {
  workflowId: string;
  onReuploadNeeded: ({
    workflowId,
    directorId,
    documentId,
    reason,
  }: {
    workflowId: string;
    directorId?: string;
    documentId: string;
    reason?: string;
  }) => () => void;
  onRemoveDecision: ({
    directorId,
    documentId,
  }: {
    directorId: string;
    documentId: string;
  }) => void;
  onApprove: ({ directorId, documentId }: { directorId: string; documentId: string }) => void;
  director: {
    id: string;
    firstName: string;
    lastName: string;
    documents: Array<{
      id: string;
      category: string;
      type: string;
      issuer: {
        country: string;
      };
      version: string;
      pages: Array<{
        type: string;
        metadata: {
          side: string;
        };
      }>;
      decision: {
        status: string;
      };
      properties: Record<PropertyKey, any>;
      propertiesSchema: Record<PropertyKey, any>;
      details: Array<{
        id: string;
        title: string;
        fileType: string;
        fileName: string;
        imageUrl: string;
      }>;
    }>;
  };
  tags: string[];
  revisionReasons: string[];
  isEditable: boolean;
  isApproveDisabled: boolean;
  documentSchemas: Array<Record<PropertyKey, any>>;
  isLoadingDocuments: boolean;
  workflow: TWorkflowById;
}) => {
  const { noAction } = useCaseDecision();

  const isDocumentsV2 = workflow?.workflowDefinition?.config?.isDocumentsV2;
  const blocks = useMemo(() => {
    const { documents } = director;
    const documentsWithoutImageUrl = isDocumentsV2
      ? documents?.map(({ details: _details, ...document }) => document)
      : documents?.map(({ details: _details, ...document }) => ({
          ...document,
          pages: document?.pages?.map(({ imageUrl: _imageUrl, ...page }) => page),
        }));

    const isDocumentRevision = documents?.some(
      document => document?.decision?.status === 'revision',
    );
    const multiDocumentsBlocks = documents?.flatMap(document => {
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
          directorId: director.id,
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
          workflowId,
          // Otherwise imageUrl will be saved into the document.
          documents: documentsWithoutImageUrl,
          isDocumentsV2: !!workflow?.workflowDefinition?.config?.isDocumentsV2,
        })
        .cellAt(0, 0);

      const getReuploadStatusOrAction = (decisionStatus: DecisionStatus, tags: string[]) => {
        const isRevision = decisionStatus === 'revision';

        if (isRevision && tags?.includes(StateTag.REVISION)) {
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
            .buildFlat();

          return pendingReUploadBlock;
        }

        if (isRevision && !tags?.includes(StateTag.REVISION)) {
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
                      onRemoveDecision({
                        directorId: director.id,
                        documentId: document.id,
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
            .buildFlat();

          return reUploadNeededBlock;
        }
      };

      const getReUploadedNeededAction = (decisionStatus: DecisionStatus) => {
        if (decisionStatus !== 'approved' && decisionStatus !== 'revision') {
          const reUploadNeededBlock = createBlocksTyped()
            .addBlock()
            .addCell({
              type: 'callToActionLegacy',
              value: {
                text: 'Re-upload needed',
                props: {
                  revisionReasons: getRevisionReasonsForDocument(document, revisionReasons),
                  disabled: (!isDoneWithRevision && Boolean(document.decision?.status)) || noAction,
                  decision: 'reject',
                  directorId: director.id,
                  id: document.id,
                  contextUpdateMethod: 'director',
                  workflow,
                  onReuploadNeeded,
                },
              },
            })
            .buildFlat();

          return reUploadNeededBlock;
        }
      };

      const getDecisionStatusOrAction = (decisionStatus: DecisionStatus) => {
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
            .buildFlat();

          return approvedBadgeBlock;
        }

        if (decisionStatus !== 'revision') {
          const isApproveActionDisabled =
            (!isDoneWithRevision && Boolean(document?.decision?.status)) ||
            noAction ||
            isApproveDisabled;

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
                      opacity: isApproveActionDisabled ? 0.5 : motionButtonProps.animate.opacity,
                    }}
                    disabled={isApproveActionDisabled}
                    size={'wide'}
                    variant={'success'}
                    className={'enabled:bg-success enabled:hover:bg-success/90'}
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
                      disabled={isApproveActionDisabled}
                      onClick={() =>
                        onApprove({
                          directorId: director.id,
                          documentId: document.id,
                        })
                      }
                    >
                      Approve
                    </Button>
                  </div>
                ),
                content: null,
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
            .buildFlat();

          return approveButtonBlock;
        }
      };

      const documentHeading = [
        getReuploadStatusOrAction(document?.decision?.status, tags),
        getReUploadedNeededAction(document?.decision?.status),
        getDecisionStatusOrAction(document?.decision?.status),
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
                      value: `${valueOrNA(titleCase(document.category ?? ''))} - ${valueOrNA(
                        titleCase(document.type ?? ''),
                      )}`,
                    })
                    .addCell({
                      type: 'details',
                      directorId: director.id,
                      contextUpdateMethod: 'director',
                      value: {
                        id: document.id,
                        data: Object.entries({
                          ...additionalProperties,
                          ...document.propertiesSchema?.properties,
                        })?.map(
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
                              (isDoneWithRevision || !document?.decision?.status) && isEditable_;

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
                      // Otherwise imageUrl will be saved into the document.
                      documents: documentsWithoutImageUrl,
                      workflowId,
                      isDocumentsV2: !!workflow?.workflowDefinition?.config?.isDocumentsV2,
                    })
                    .addCell(decisionCell)
                    .buildFlat(),
                })
                .addCell({
                  type: 'container',
                  value: createBlocksTyped()
                    .addBlock()
                    .addCell({
                      type: 'multiDocuments',
                      isLoading: isLoadingDocuments,
                      value: {
                        data: document?.details,
                      },
                    })
                    .buildFlat(),
                })
                .buildFlat(),
            })
            .buildFlat(),
        })
        .buildFlat();
    });

    if (!multiDocumentsBlocks?.length) {
      return [];
    }

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
              .buildFlat(),
          })
          .build()
          .concat(multiDocumentsBlocks ?? [])
          .flat(1),
        className: ctw({
          'shadow-[0_4px_4px_0_rgba(174,174,174,0.0625)] border-[1px] border-warning':
            isDocumentRevision,
          'bg-warning/10': isDocumentRevision && !tags?.includes(StateTag.REVISION),
        }),
      })
      .build();
  }, [
    director,
    documentSchemas,
    isApproveDisabled,
    isEditable_,
    isLoadingDocuments,
    noAction,
    onApprove,
    onRemoveDecision,
    onReuploadNeeded,
    revisionReasons,
    tags,
    workflow,
    workflowId,
  ]);

  return blocks;
};
