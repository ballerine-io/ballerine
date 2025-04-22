import { MotionButton } from '@/common/components/molecules/MotionButton/MotionButton';
import { checkIsIndividual } from '@/common/utils/check-is-individual/check-is-individual';
import { ctw } from '@/common/utils/ctw/ctw';
import { useApproveDocumentByIdMutation } from '@/domains/documents/hooks/mutations/useApproveDocumentByIdMutation/useApproveDocumentByIdMutation';
import { useRejectDocumentByIdMutation } from '@/domains/documents/hooks/mutations/useRejectDocumentByIdMutation/useRejectDocumentByIdMutation';
import { useRemoveDocumentDecisionByIdMutation } from '@/domains/documents/hooks/mutations/useRemoveDocumentDecisionByIdMutation/useRemoveDocumentDecisionByIdMutation';
import { useApproveTaskByIdMutation } from '@/domains/entities/hooks/mutations/useApproveTaskByIdMutation/useApproveTaskByIdMutation';
import { useDocumentOcr } from '@/domains/entities/hooks/mutations/useDocumentOcr/useDocumentOcr';
import { useRejectTaskByIdMutation } from '@/domains/entities/hooks/mutations/useRejectTaskByIdMutation/useRejectTaskByIdMutation';
import { useRemoveTaskDecisionByIdMutation } from '@/domains/entities/hooks/mutations/useRemoveTaskDecisionByIdMutation/useRemoveTaskDecisionByIdMutation';
import { TWorkflowById } from '@/domains/workflows/fetchers';
import { createBlocksTyped } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';
import { motionButtonProps } from '@/lib/blocks/hooks/useAssosciatedCompaniesBlock/useAssociatedCompaniesBlock';
import { useCommentInputLogic } from '@/lib/blocks/hooks/useDocumentBlocks/hooks/useCommentInputLogic/useCommentInputLogic';
import { checkCanApprove } from '@/lib/blocks/hooks/useDocumentBlocks/utils/check-can-approve/check-can-approve';
import { checkCanReject } from '@/lib/blocks/hooks/useDocumentBlocks/utils/check-can-reject/check-can-reject';
import { checkCanRevision } from '@/lib/blocks/hooks/useDocumentBlocks/utils/check-can-revision/check-can-revision';
import { motionBadgeProps } from '@/lib/blocks/motion-badge-props';
import { useCaseState } from '@/pages/Entity/components/Case/hooks/useCaseState/useCaseState';
import {
  composePickableCategoryType,
  isExistingSchemaForDocument,
} from '@/pages/Entity/hooks/useEntityLogic/utils';
import { CommonWorkflowStates, StateTag, TDocument, valueOrNA } from '@ballerine/common';
import { Button, TextArea } from '@ballerine/ui';
import { X } from 'lucide-react';
import * as React from 'react';
import { FunctionComponent, useCallback } from 'react';
import { titleCase } from 'string-ts';
import { useDocuments } from './hooks/useDocuments';
import { keyFactory } from '@/common/utils/key-factory/key-factory';
import { ExtractCellProps } from '@ballerine/blocks';

export const useDocumentBlocks = ({
  workflow,
  parentMachine,
  noAction,
  caseState,
  withEntityNameInHeader,
  onReuploadNeeded,
  isLoadingReuploadNeeded,
  dialog,
  actions,
}: {
  workflow: TWorkflowById;
  parentMachine: TWorkflowById['context']['parentMachine'];
  noAction: boolean;
  caseState: ReturnType<typeof useCaseState>;
  withEntityNameInHeader: boolean;
  onReuploadNeeded: ({
    workflowId,
    documentId,
    reason,
  }: {
    workflowId: string;
    documentId: string;
    reason?: string;
  }) => () => void;
  isLoadingReuploadNeeded: boolean;
  dialog: {
    reupload: {
      Description: FunctionComponent;
    };
  };
  actions?: {
    reuploadNeeded?: {
      isDisabled?: boolean;
    };
  };
}) => {
  const {
    businessDocuments,
    directorsDocuments,
    ubosDocuments,
    businessDocumentsSchemas,
    directorsDocumentsSchemas,
    ubosDocumentsSchemas,
    isLoading: isLoadingDocuments,
  } = useDocuments(workflow);

  const { mutate: mutateApproveTaskById, isLoading: isLoadingApproveTaskById } =
    useApproveTaskByIdMutation(workflow?.id);
  const { mutate: mutateApproveDocumentById, isLoading: isLoadingApproveDocumentById } =
    useApproveDocumentByIdMutation();
  const {
    mutate: mutateOCRDocument,
    isLoading: isLoadingOCRDocument,
    data: ocrResult,
  } = useDocumentOcr({
    workflowId: workflow?.id,
  });

  const { isLoading: isLoadingRejectTaskById } = useRejectTaskByIdMutation(workflow?.id);
  const { isLoading: isLoadingRejectDocumentById } = useRejectDocumentByIdMutation();

  const { comment, onClearComment, onCommentChange } = useCommentInputLogic();
  const onMutateApproveTaskById = useCallback(
    ({
        taskId,
        contextUpdateMethod,
        comment,
      }: {
        taskId: string;
        contextUpdateMethod: 'base' | 'director';
        comment?: string;
      }) =>
      () => {
        if (!workflow?.workflowDefinition?.config?.isDocumentsV2) {
          mutateApproveTaskById({ documentId: taskId, contextUpdateMethod, comment });
        }

        if (workflow?.workflowDefinition?.config?.isDocumentsV2) {
          mutateApproveDocumentById({ documentId: taskId, decisionReason: '', comment });
        }

        onClearComment();
      },
    [
      mutateApproveDocumentById,
      mutateApproveTaskById,
      onClearComment,
      workflow?.workflowDefinition?.config?.isDocumentsV2,
    ],
  );
  const { mutate: mutateRemoveTaskDecisionById } = useRemoveTaskDecisionByIdMutation(workflow?.id);
  const { mutate: mutateRemoveDocumentDecisionById } = useRemoveDocumentDecisionByIdMutation();

  const onMutateRemoveDecisionById = useCallback(
    ({
      documentId,
      contextUpdateMethod,
    }: {
      documentId: string;
      contextUpdateMethod: 'base' | 'director';
    }) => {
      if (workflow?.workflowDefinition?.config?.isDocumentsV2) {
        mutateRemoveDocumentDecisionById({ documentId });

        return;
      }

      mutateRemoveTaskDecisionById({ documentId, contextUpdateMethod });
    },
    [
      mutateRemoveDocumentDecisionById,
      mutateRemoveTaskDecisionById,
      workflow?.workflowDefinition?.config?.isDocumentsV2,
    ],
  );
  const formatDocument =
    ({
      documents,
      documentsSchemas,
    }: {
      documents: TDocument[];
      documentsSchemas:
        | typeof businessDocumentsSchemas
        | typeof directorsDocumentsSchemas
        | typeof ubosDocumentsSchemas;
    }) =>
    ({
      id,
      type: docType,
      category,
      properties,
      propertiesSchema,
      decision,
      details,
      entityType,
      entity,
    }: TDocument) => {
      const additionalProperties = isExistingSchemaForDocument(documentsSchemas ?? [])
        ? composePickableCategoryType(
            category,
            docType,
            documentsSchemas ?? [],
            workflow?.workflowDefinition?.config,
          )
        : {};
      const isDoneWithRevision =
        decision?.status === 'revised' && parentMachine?.status === 'completed';
      const isDocumentRevision =
        decision?.status === CommonWorkflowStates.REVISION && (!isDoneWithRevision || noAction);

      const isLegacyReject = workflow?.workflowDefinition?.config?.isLegacyReject;
      const canRevision = checkCanRevision({
        caseState,
        noAction,
        workflow,
        decision,
        isLoadingRevision: isLoadingReuploadNeeded,
      });
      const canReject = checkCanReject({
        caseState,
        noAction,
        workflow,
        decision,
        isLoadingReject: isLoadingRejectTaskById || isLoadingRejectDocumentById,
      });
      const canApprove = checkCanApprove({
        caseState,
        noAction,
        workflow,
        decision,
        isLoadingApprove: isLoadingApproveTaskById || isLoadingApproveDocumentById,
      });
      const getDecisionStatusOrAction = (isDocumentRevision: boolean) => {
        const badgeClassNames = 'text-sm font-bold';

        if (isDocumentRevision && workflow?.tags?.includes(StateTag.REVISION)) {
          return createBlocksTyped()
            .addBlock()
            .addCell({
              type: 'badge',
              value: 'Pending re-upload',
              props: {
                ...motionBadgeProps,
                variant: 'warning',
                className: badgeClassNames,
              },
            })
            .build()
            .flat(1);
        }

        if (isDocumentRevision && !workflow?.tags?.includes(StateTag.REVISION)) {
          return createBlocksTyped()
            .addBlock()
            .addCell({
              type: 'badge',
              value: (
                <React.Fragment>
                  Re-upload needed
                  {!isLegacyReject && (
                    <X
                      className="size-4 cursor-pointer"
                      onClick={() =>
                        onMutateRemoveDecisionById({
                          documentId: id,
                          contextUpdateMethod: 'base',
                        })
                      }
                    />
                  )}
                </React.Fragment>
              ),
              props: {
                ...motionBadgeProps,
                variant: 'warning',
                className: `gap-x-1 text-white bg-warning ${badgeClassNames}`,
              },
            })
            .buildFlat();
        }

        if (decision?.status === StateTag.APPROVED) {
          return createBlocksTyped()
            .addBlock()
            .addCell({
              type: 'badge',
              value: 'Approved',
              props: {
                ...motionBadgeProps,
                variant: 'success',
                className: `${badgeClassNames} bg-success/20`,
              },
            })
            .buildFlat();
        }

        if (decision?.status === StateTag.REJECTED) {
          return createBlocksTyped()
            .addBlock()
            .addCell({
              type: 'badge',
              value: 'Rejected',
              props: {
                ...motionBadgeProps,
                variant: 'destructive',
                className: badgeClassNames,
              },
            })
            .buildFlat();
        }

        const revisionReasons =
          workflow?.workflowDefinition?.contextSchema?.schema?.properties?.documents?.items?.properties?.decision?.properties?.revisionReason?.anyOf?.find(
            ({ enum: enum_ }) => !!enum_,
          )?.enum;
        const rejectionReasons =
          workflow?.workflowDefinition?.contextSchema?.schema?.properties?.documents?.items?.properties?.decision?.properties?.rejectionReason?.anyOf?.find(
            ({ enum: enum_ }) => !!enum_,
          )?.enum;

        return createBlocksTyped()
          .addBlock()
          .addCell({
            type: 'callToActionLegacy',
            // 'Reject' displays the dialog with both "block" and "ask for re-upload" options
            value: {
              text: isLegacyReject ? 'Reject' : 'Re-upload needed',
              props: {
                revisionReasons,
                rejectionReasons,
                id,
                workflow,
                disabled:
                  actions?.reuploadNeeded?.isDisabled ||
                  (isLegacyReject ? !canReject && !canRevision : !canRevision),
                onReuploadNeeded,
                isLoadingReuploadNeeded,
                decision: 'reject',
                dialog,
              },
            },
          })
          .addCell({
            type: 'dialog',
            value: {
              trigger: (
                <MotionButton
                  {...motionButtonProps}
                  animate={{
                    ...motionButtonProps.animate,
                    opacity: !canApprove ? 0.5 : motionButtonProps.animate.opacity,
                  }}
                  disabled={!canApprove}
                  size={'wide'}
                  variant={'success'}
                  className={'enabled:bg-success enabled:hover:bg-success/90'}
                >
                  Approve
                </MotionButton>
              ),
              title: `Approval confirmation`,
              description: <p className={`text-sm`}>Are you sure you want to approve?</p>,
              content: (
                <TextArea
                  placeholder={'Add a comment'}
                  value={comment || ''}
                  onChange={onCommentChange}
                />
              ),
              close: (
                <div className={`space-x-2`}>
                  <Button type={'button'} variant={`secondary`} onClick={onClearComment}>
                    Cancel
                  </Button>
                  <Button
                    disabled={!canApprove}
                    onClick={onMutateApproveTaskById({
                      taskId: id,
                      contextUpdateMethod: 'base',
                      comment,
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
          .buildFlat();
      };

      const categoryOrNA = valueOrNA(titleCase(category ?? ''));
      const documentTypeOrNA = valueOrNA(titleCase(docType ?? ''));
      const documentNameOrNA = `${categoryOrNA} - ${documentTypeOrNA}`;

      const getHeaderContentCell = (): ExtractCellProps<'heading'>['value'] => {
        if (entity?.id === workflow?.context?.entity?.data?.ballerineEntityId) {
          return documentNameOrNA;
        }

        return (
          <div className="flex flex-col">
            <span>{documentNameOrNA}</span>
            <div className="mt-1 flex items-center gap-1.5">
              <span className="rounded-md bg-gray-100 px-4 py-1 text-xs font-semibold text-gray-700">
                {entityType}
              </span>
              {(entityType !== 'business' || withEntityNameInHeader) && entity?.name && (
                <span className="text-sm text-gray-500">{valueOrNA(titleCase(entity?.name))}</span>
              )}
            </div>
          </div>
        );
      };

      const headerCell = createBlocksTyped()
        .addBlock()
        .addCell({
          id: 'header',
          type: 'container',
          props: {
            className: 'items-start',
          },
          value: createBlocksTyped()
            .addBlock()
            .addCell({
              type: 'heading',
              value: getHeaderContentCell(),
            })
            .addCell({
              id: 'actions',
              type: 'container',
              value: getDecisionStatusOrAction(isDocumentRevision),
            })
            .buildFlat(),
        })
        .cellAt(0, 0);

      const decisionCell = createBlocksTyped()
        .addBlock()
        .addCell({
          type: 'details',
          hideSeparator: true,
          value: {
            id,
            title: 'Decision',
            data: decision?.status
              ? Object.entries(decision ?? {}).map(([title, value]) => ({
                  title,
                  value,
                }))
              : [],
          },
          workflowId: workflow?.id,
          documents: documents?.map(({ details: _details, ...document }) => document),
          isDocumentsV2: !!workflow?.workflowDefinition?.config?.isDocumentsV2,
        })
        .cellAt(0, 0);
      const documentEntries = Object.entries({
        ...additionalProperties,
        ...propertiesSchema?.properties,
      }).map(([title, formattedValue]) => {
        return [title, formattedValue];
      });

      const detailsCell = createBlocksTyped()
        .addBlock()
        .addCell({
          type: 'container',
          value: createBlocksTyped()
            .addBlock()
            .addCell({
              id: 'decision',
              type: 'details',
              value: {
                id,
                title: `${category} - ${docType}`,
                data: documentEntries?.map(
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
                      default: defaultValue,
                    },
                  ]) => {
                    const getFieldValue = () => {
                      if (typeof value !== 'undefined') {
                        return value;
                      }

                      if (ocrResult?.parsedData?.[title]) {
                        const isOcrValueString = typeof ocrResult.parsedData[title] === 'string';

                        if (isOcrValueString && ocrResult.parsedData[title].length > 0) {
                          return ocrResult.parsedData[title];
                        }

                        if (!isOcrValueString) {
                          return ocrResult.parsedData[title];
                        }
                      }

                      if (
                        typeof properties?.[title] === 'undefined' &&
                        typeof defaultValue !== 'undefined'
                      ) {
                        return defaultValue;
                      }

                      if (typeof properties?.[title] === 'undefined' && type === 'boolean') {
                        return false;
                      }

                      if (typeof properties?.[title] === 'undefined') {
                        return '';
                      }

                      return properties?.[title];
                    };
                    const fieldValue = getFieldValue();
                    const isEditableDecision = isDoneWithRevision || !decision?.status;
                    const isIndividual = checkIsIndividual(workflow);
                    const isEditableCategory =
                      (title === 'category' && isIndividual) || title !== 'category';
                    const isEditableField = [
                      isEditableDecision,
                      isEditable,
                      caseState.writeEnabled,
                      isEditableCategory,
                    ].every(Boolean);

                    return {
                      title,
                      value: fieldValue,
                      type,
                      format,
                      pattern,
                      isEditable: isEditableField,
                      dropdownOptions,
                      minimum: formatMinimum,
                      maximum: formatMaximum,
                    };
                  },
                ),
              },
              props: {
                config: {
                  sort: { predefinedOrder: ['category', 'type'] },
                },
              },
              workflowId: workflow?.id,
              isSaveDisabled: isLoadingOCRDocument,
              documents: documents?.map(({ details: _details, ...document }) => document),
              isDocumentsV2: !!workflow?.workflowDefinition?.config?.isDocumentsV2,
            })
            .addCell(decisionCell)
            .buildFlat(),
        })
        .cellAt(0, 0);

      const documentsCell = createBlocksTyped()
        .addBlock()
        .addCell({
          type: 'multiDocuments',
          value: {
            isLoading: isLoadingDocuments,
            onOcrPressed: () => mutateOCRDocument({ documentId: id }),
            isDocumentEditable: caseState.writeEnabled,
            isLoadingOCR: isLoadingOCRDocument,
            data: details,
          },
        })
        .cellAt(0, 0);

      return createBlocksTyped()
        .addBlock()
        .addCell({
          type: 'block',
          keyProp: 'key',
          key: keyFactory('document', id, docType, category),
          className: ctw({
            'shadow-[0_4px_4px_0_rgba(174,174,174,0.0625)] border-[1px] border-warning':
              isDocumentRevision,
            'bg-warning/10': isDocumentRevision && !workflow?.tags?.includes(StateTag.REVISION),
          }),
          props: {
            contentClassName:
              'grid grid-cols-[1fr_minmax(240px,280px)] md:grid-cols-[1fr_minmax(240px,360px)] lg:grid-cols-[1fr_minmax(240px,441px)] 2xl:grid-cols-[1fr_minmax(240px,600px)] grid-rows-[auto_1fr] gap-4 [&>*:first-child]:col-span-2',
          },
          value: createBlocksTyped()
            .addBlock()
            .addCell(headerCell)
            .addCell(detailsCell)
            .addCell(documentsCell)
            .buildFlat(),
        })
        .build();
    };

  return {
    businessDocumentBlocks:
      businessDocuments?.flatMap(
        formatDocument({
          documents: businessDocuments,
          documentsSchemas: businessDocumentsSchemas,
          isBusinessDocument: true,
        }),
      ) ?? [],
    directorDocumentBlocks:
      directorsDocuments?.flatMap(
        formatDocument({
          documents: directorsDocuments,
          documentsSchemas: directorsDocumentsSchemas,
          isBusinessDocument: false,
        }),
      ) ?? [],
    uboDocumentBlocks:
      ubosDocuments?.flatMap(
        formatDocument({
          documents: ubosDocuments,
          documentsSchemas: ubosDocumentsSchemas,
          isBusinessDocument: false,
        }),
      ) ?? [],
  };
};
