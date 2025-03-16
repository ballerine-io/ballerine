import { useDocumentsByEntityIdsAndWorkflowIdQuery } from '@/domains/documents/hooks/queries/useDocumentsByEntityIdsAndWorkflowIdQuery/useDocumentsByEntityIdsAndWorkflowIdQuery';
import { useWorkflowByIdQuery } from '@/domains/workflows/hooks/queries/useWorkflowByIdQuery/useWorkflowByIdQuery';
import { useCaseState } from '@/pages/Entity/components/Case/hooks/useCaseState/useCaseState';
import { useCallback, useMemo, useState } from 'react';
import { useFilterId } from '../../../../../../common/hooks/useFilterId/useFilterId';
import { useAuthenticatedUserQuery } from '../../../../../../domains/auth/hooks/queries/useAuthenticatedUserQuery/useAuthenticatedUserQuery';
import { useApproveCaseAndDocumentsMutation } from '../../../../../../domains/entities/hooks/mutations/useApproveCaseAndDocumentsMutation/useApproveCaseAndDocumentsMutation';
import { useRevisionCaseAndDocumentsMutation } from '../../../../../../domains/entities/hooks/mutations/useRevisionCaseAndDocumentsMutation/useRevisionCaseAndDocumentsMutation';
import { TWorkflowById } from '../../../../../../domains/workflows/fetchers';

export const useCaseCallToActionLegacyLogic = ({
  parentWorkflowId,
  childWorkflowId,
  childWorkflowContextSchema,
  documentsType = 'kyb',
}: {
  parentWorkflowId: string;
  childWorkflowId: string;
  childWorkflowContextSchema: NonNullable<
    TWorkflowById['childWorkflows']
  >[number]['workflowDefinition']['contextSchema'];
  documentsType: 'kyb' | 'kyc';
}) => {
  const filterId = useFilterId();

  // State
  const revisionReasons =
    childWorkflowContextSchema?.schema?.properties?.documents?.items?.properties?.decision?.properties?.revisionReason?.anyOf?.find(
      ({ enum: enum_ }) => !!enum_,
    )?.enum as string[];

  const noReasons = !revisionReasons?.length;
  const [reason, setReason] = useState(revisionReasons?.[0] ?? '');
  const [comment, setComment] = useState('');
  const reasonWithComment = comment ? `${reason} - ${comment}` : reason;

  // /State

  // Queries
  const { data: session } = useAuthenticatedUserQuery();
  // Parent workflow
  const { data: parentWorkflow } = useWorkflowByIdQuery({
    workflowId: parentWorkflowId,
    filterId,
  });

  const childWorkflow = parentWorkflow?.childWorkflows?.find(
    workflow => workflow.id === childWorkflowId,
  );
  const { data: documents } = useDocumentsByEntityIdsAndWorkflowIdQuery({
    workflowId: parentWorkflowId,
    entityIds: [childWorkflow?.context?.entity?.ballerineEntityId ?? ''],
  });

  const documentIds = useMemo(() => {
    if (documentsType === 'kyc') {
      return (
        documents
          ?.filter(document => document.type === 'identification_document')
          ?.map(document => document.id) ?? []
      );
    }

    return (
      // 'identification_document' is exclusive to Veriff
      documents
        ?.filter(document => document.type !== 'identification_document')
        ?.map(document => document.id) ?? []
    );
  }, [documents, documentsType]);
  // /Queries

  // Mutations
  const { mutate: mutateApproveCase, isLoading: isLoadingApproveCase } =
    useApproveCaseAndDocumentsMutation({
      workflowId: childWorkflowId,
      ids: documentIds,
      isDocumentsV2:
        documentsType === 'kyc'
          ? false
          : !!parentWorkflow?.workflowDefinition?.config?.isDocumentsV2,
    });
  const { mutate: mutateRevisionCase, isLoading: isLoadingRevisionCase } =
    useRevisionCaseAndDocumentsMutation({
      workflowId: childWorkflowId,
      ids: documentIds,
      isDocumentsV2:
        documentsType === 'kyc'
          ? false
          : !!parentWorkflow?.workflowDefinition?.config?.isDocumentsV2,
    });
  // /Mutations

  // Callbacks
  const onReasonChange = useCallback((value: string) => setReason(value), [setReason]);
  const onCommentChange = useCallback((value: string) => setComment(value), [setComment]);
  const onMutateApproveCase = useCallback(() => mutateApproveCase(), [mutateApproveCase]);
  const onMutateRevisionCase = useCallback(
    (revisionReason: string) => () =>
      mutateRevisionCase({
        revisionReason,
      }),
    [mutateRevisionCase],
  );
  // /Callbacks

  const caseState = useCaseState(session?.user, parentWorkflow);
  const isLoading = isLoadingApproveCase || isLoadingRevisionCase;
  const isDisabled = !caseState.actionButtonsEnabled || isLoading;

  return {
    // Callbacks
    onMutateApproveCase,
    onMutateRevisionCase,
    onReasonChange,
    onCommentChange,
    // /Callbacks

    // State
    reason,
    comment,
    noReasons,
    isDisabled,
    reasons: revisionReasons,
    reasonWithComment,
    // /State

    // Loading state
    isLoadingApproveCase,
    isLoadingRevisionCase,
    // Loading states
  };
};
