import { MotionButton } from '@/common/components/molecules/MotionButton/MotionButton';
import { checkIsBusiness } from '@/common/utils/check-is-business/check-is-business';
import { ctw } from '@/common/utils/ctw/ctw';
import { CommonWorkflowStates, StateTag, valueOrNA } from '@ballerine/common';
import { useApproveTaskByIdMutation } from '@/domains/entities/hooks/mutations/useApproveTaskByIdMutation/useApproveTaskByIdMutation';
import { useRejectTaskByIdMutation } from '@/domains/entities/hooks/mutations/useRejectTaskByIdMutation/useRejectTaskByIdMutation';
import { useRemoveDecisionTaskByIdMutation } from '@/domains/entities/hooks/mutations/useRemoveDecisionTaskByIdMutation/useRemoveDecisionTaskByIdMutation';
import { useStorageFilesQuery } from '@/domains/storage/hooks/queries/useStorageFilesQuery/useStorageFilesQuery';
import { TWorkflowById } from '@/domains/workflows/fetchers';
import { createBlocksTyped } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';
import { motionButtonProps } from '@/lib/blocks/hooks/useAssosciatedCompaniesBlock/useAssociatedCompaniesBlock';
import { useCommentInputLogic } from '@/lib/blocks/hooks/useDocumentBlocks/hooks/useCommentInputLogic/useCommentInputLogic';
import { checkCanApprove } from '@/lib/blocks/hooks/useDocumentBlocks/utils/check-can-approve/check-can-approve';
import { checkCanReject } from '@/lib/blocks/hooks/useDocumentBlocks/utils/check-can-reject/check-can-reject';
import { checkCanRevision } from '@/lib/blocks/hooks/useDocumentBlocks/utils/check-can-revision/check-can-revision';
import { useDocumentPageImages } from '@/lib/blocks/hooks/useDocumentPageImages';
import { motionBadgeProps } from '@/lib/blocks/motion-badge-props';
import { useCaseState } from '@/pages/Entity/components/Case/hooks/useCaseState/useCaseState';
import {
  checkIsEditable,
  composePickableCategoryType,
  extractCountryCodeFromWorkflow,
  isExistingSchemaForDocument,
} from '@/pages/Entity/hooks/useEntityLogic/utils';
import { selectWorkflowDocuments } from '@/pages/Entity/selectors/selectWorkflowDocuments';
import { getDocumentsSchemas } from '@/pages/Entity/utils/get-documents-schemas/get-documents-schemas';
import { Button, TextArea } from '@ballerine/ui';
import { X } from 'lucide-react';
import * as React from 'react';
import { FunctionComponent, useCallback, useMemo } from 'react';
import { toTitleCase } from 'string-ts';
import { useDocumentOcr } from '@/domains/entities/hooks/mutations/useDocumentOcr/useDocumentOcr';

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
  const issuerCountryCode = extractCountryCodeFromWorkflow(workflow);
  const documentsSchemas = getDocumentsSchemas(issuerCountryCode, workflow);
  const documents = useMemo(() => selectWorkflowDocuments(workflow), [workflow]);
  const documentPages = useMemo(
    () => documents.flatMap(({ pages }) => pages?.map(({ ballerineFileId }) => ballerineFileId)),
    [documents],
  );
  const storageFilesQueryResult = useStorageFilesQuery(documentPages);
  const documentPagesResults = useDocumentPageImages(documents, storageFilesQueryResult);

  const { mutate: mutateApproveTaskById, isLoading: isLoadingApproveTaskById } =
    useApproveTaskByIdMutation(workflow?.id);
  const {
    mutate: mutateOCRDocument,
    isLoading: isLoadingOCRDocument,
    data: ocrResult,
  } = useDocumentOcr({
    workflowId: workflow?.id,
  });

  const { isLoading: isLoadingRejectTaskById } = useRejectTaskByIdMutation(workflow?.id);

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
        mutateApproveTaskById({ documentId: taskId, contextUpdateMethod, comment });
        onClearComment();
      },
    [mutateApproveTaskById, onClearComment],
  );
  const { mutate: onMutateRemoveDecisionById } = useRemoveDecisionTaskByIdMutation(workflow?.id);

  return (
    documents?.flatMap(
      ({ id, type: docType, category, properties, propertiesSchema, decision }, docIndex) => {
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
          isLoadingReject: isLoadingRejectTaskById,
        });
        const canApprove = checkCanApprove({
          caseState,
          noAction,
          workflow,
          decision,
          isLoadingApprove: isLoadingApproveTaskById,
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
                        className="h-4 w-4 cursor-pointer"
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
              .build()
              .flat(1);
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
              .build()
              .flat(1);
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
              .build()
              .flat(1);
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
            .build()
            .flat(1);
        };

        const entityNameOrNA = valueOrNA(toTitleCase(workflow?.entity?.name ?? ''));
        const categoryOrNA = valueOrNA(toTitleCase(category ?? ''));
        const documentTypeOrNA = valueOrNA(toTitleCase(docType ?? ''));
        const documentNameOrNA = `${categoryOrNA}${
          withEntityNameInHeader ? '' : ` - ${documentTypeOrNA}`
        }`;
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
                value: `${withEntityNameInHeader ? `${entityNameOrNA} - ` : ''}${documentNameOrNA}`,
              })
              .addCell({
                id: 'actions',
                type: 'container',
                value: getDecisionStatusOrAction(isDocumentRevision),
              })
              .build()
              .flat(1),
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
            documents: workflow?.context?.documents,
          })
          .cellAt(0, 0);

        const documentEntries = Object.entries(
          {
            ...additionalProperties,
            ...propertiesSchema?.properties,
          } ?? {},
        ).map(([title, formattedValue]) => {
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
                      const isEditableType =
                        (title === 'type' && !checkIsBusiness(workflow)) || title !== 'type';

                      return {
                        title,
                        value: fieldValue,
                        type,
                        format,
                        pattern,
                        isEditable:
                          isEditableDecision &&
                          caseState.writeEnabled &&
                          checkIsEditable({ isEditable, field: title }) &&
                          isEditableType,
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
                documents: workflow?.context?.documents,
              })
              .addCell(decisionCell)
              .build()
              .flat(1),
          })
          .cellAt(0, 0);

        const documentsCell = createBlocksTyped()
          .addBlock()
          .addCell({
            type: 'multiDocuments',
            value: {
              isLoading: storageFilesQueryResult?.some(({ isLoading }) => isLoading),
              onOcrPressed: () => mutateOCRDocument({ documentId: id }),
              isDocumentEditable: caseState.writeEnabled,
              isLoadingOCR: isLoadingOCRDocument,
              data:
                documents?.[docIndex]?.pages?.map(
                  ({ type, fileName, metadata, ballerineFileId }, pageIndex) => ({
                    id: ballerineFileId,
                    title: `${valueOrNA(toTitleCase(category ?? ''))} - ${valueOrNA(
                      toTitleCase(docType ?? ''),
                    )}${metadata?.side ? ` - ${metadata?.side}` : ''}`,
                    imageUrl: documentPagesResults?.[docIndex]?.[pageIndex],
                    fileType: type,
                    fileName,
                  }),
                ) ?? [],
            },
          })
          .cellAt(0, 0);

        return createBlocksTyped()
          .addBlock()
          .addCell({
            type: 'block',
            className: ctw({
              'shadow-[0_4px_4px_0_rgba(174,174,174,0.0625)] border-[1px] border-warning':
                isDocumentRevision,
              'bg-warning/10': isDocumentRevision && !workflow?.tags?.includes(StateTag.REVISION),
            }),
            value: createBlocksTyped()
              .addBlock()
              .addCell(headerCell)
              .addCell(detailsCell)
              .addCell(documentsCell)
              .build()
              .flat(1),
          })
          .build();
      },
    ) ?? []
  );
};
