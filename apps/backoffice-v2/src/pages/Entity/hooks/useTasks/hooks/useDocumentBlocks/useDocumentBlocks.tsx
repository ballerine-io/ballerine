import { toTitleCase } from 'string-ts';
import { TWorkflowById } from '@/domains/workflows/fetchers';
import { useCaseState } from '@/pages/Entity/components/Case/hooks/useCaseState/useCaseState';
import {
  composePickableCategoryType,
  extractCountryCodeFromWorkflow,
  getIsEditable,
  isExistingSchemaForDocument,
} from '@/pages/Entity/hooks/useEntity/utils';
import { getPostApproveEventNameEvent } from '@/pages/Entity/components/CallToActionLegacy/hooks/useCallToActionLegacyLogic/useCallToActionLegacyLogic';
import * as React from 'react';
import { useCallback, useMemo } from 'react';
import { selectWorkflowDocuments } from '@/pages/Entity/hooks/useTasks/selectors/selectWorkflowDocuments';
import { useStorageFilesQuery } from '@/domains/storage/hooks/queries/useStorageFilesQuery/useStorageFilesQuery';
import { useDocumentPageImages } from '@/pages/Entity/hooks/useTasks/hooks/useDocumentPageImages';
import { useApproveTaskByIdMutation } from '@/domains/entities/hooks/mutations/useApproveTaskByIdMutation/useApproveTaskByIdMutation';
import { getPostRemoveDecisionEventName } from '@/pages/Entity/hooks/useTasks/get-post-remove-decision-event-name';
import { useRemoveDecisionTaskByIdMutation } from '@/domains/entities/hooks/mutations/useRemoveDecisionTaskByIdMutation/useRemoveDecisionTaskByIdMutation';
import { CommonWorkflowStates, StateTag } from '@ballerine/common';
import { motionProps } from '@/pages/Entity/hooks/useTasks/motion-props';
import { X } from 'lucide-react';
import { valueOrNA } from '@/common/utils/value-or-na/value-or-na';
import { getDocumentsSchemas } from '@/pages/Entity/hooks/useTasks/utils/get-documents-schemas/get-documents-schemas';
import { createBlocksTyped } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';
import { ctw } from '@/common/utils/ctw/ctw';

export const useDocumentBlocks = ({
  workflow,
  parentMachine,
  noAction,
  caseState,
  withEntityNameInHeader,
}: {
  workflow: TWorkflowById;
  parentMachine: TWorkflowById['context']['parentMachine'];
  noAction: boolean;
  caseState: ReturnType<typeof useCaseState>;
  withEntityNameInHeader: boolean;
}) => {
  const issuerCountryCode = extractCountryCodeFromWorkflow(workflow);
  const documentsSchemas = getDocumentsSchemas(issuerCountryCode, workflow);
  const postApproveEventName = getPostApproveEventNameEvent(workflow);
  const documents = useMemo(() => selectWorkflowDocuments(workflow), [workflow]);
  const documentPages = useMemo(
    () => documents.flatMap(({ pages }) => pages?.map(({ ballerineFileId }) => ballerineFileId)),
    [documents],
  );
  const storageFilesQueryResult = useStorageFilesQuery(documentPages);
  const documentPagesResults = useDocumentPageImages(documents, storageFilesQueryResult);

  const { mutate: mutateApproveTaskById, isLoading: isLoadingApproveTaskById } =
    useApproveTaskByIdMutation(workflow?.id, postApproveEventName);
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
  const postRemoveDecisionEventName = getPostRemoveDecisionEventName(workflow);
  const { mutate: onMutateRemoveDecisionById } = useRemoveDecisionTaskByIdMutation(
    workflow?.id,
    postRemoveDecisionEventName,
  );

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
        const getDecisionStatusOrAction = (isDocumentRevision: boolean) => {
          const badgeClassNames = 'text-sm font-bold';

          if (isDocumentRevision && workflow?.tags?.includes(StateTag.REVISION)) {
            return createBlocksTyped()
              .addBlock()
              .addCell({
                type: 'badge',
                value: 'Pending re-upload',
                props: {
                  ...motionProps,
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
                        onClick={() => onMutateRemoveDecisionById({ documentId: id })}
                      />
                    )}
                  </React.Fragment>
                ),
                props: {
                  ...motionProps,
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
                  ...motionProps,
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
                  ...motionProps,
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
                    (!isDoneWithRevision && Boolean(decision?.status)) ||
                    noAction ||
                    !caseState.actionButtonsEnabled,
                  decision: 'reject',
                },
              },
            })
            .addCell({
              type: 'callToAction',
              value: {
                text: 'Approve',
                onClick: onMutateApproveTaskById({
                  taskId: id,
                  contextUpdateMethod: 'base',
                }),
                props: {
                  disabled:
                    (!isDoneWithRevision && Boolean(decision?.status)) ||
                    noAction ||
                    isLoadingApproveTaskById ||
                    !caseState.actionButtonsEnabled,
                  size: 'wide',
                  variant: 'success',
                },
              },
            })
            .build()
            .flat(1);
        };

        const entityNameOrNA = valueOrNA(toTitleCase(workflow?.entity?.name ?? ''));
        const categoryOrNA = valueOrNA(toTitleCase(category ?? ''));
        const documentTypeOrNA = valueOrNA(toTitleCase(docType ?? ''));
        const documentNameOrNA = `${categoryOrNA} ${
          withEntityNameInHeader ? '' : ` ${documentTypeOrNA}`
        }`;
        const headerCell = createBlocksTyped()
          .addBlock()
          .addCell({
            id: 'header',
            type: 'container',
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
            value: {
              id,
              title: 'Decision',
              hideSeparator: true,
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
                  data: Object.entries(
                    {
                      ...additionalProperties,
                      ...propertiesSchema?.properties,
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
                        minimum: formatMinimum,
                        maximum: formatMaximum,
                      };
                    },
                  ),
                },
                workflowId: workflow?.id,
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
