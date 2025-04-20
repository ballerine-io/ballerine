import { useKycDocumentsAdapter } from '@/domains/documents/hooks/adapters/useKycDocumentsAdapter/useKycDocumentsAdapter';
import { useWorkflowByIdQuery } from '@/domains/workflows/hooks/queries/useWorkflowByIdQuery/useWorkflowByIdQuery';
import { useCaseState } from '@/pages/Entity/components/Case/hooks/useCaseState/useCaseState';
import { TDocument } from '@ballerine/common';
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
  isKYC,
}: {
  parentWorkflowId: string;
  childWorkflowId: string;
  childWorkflowContextSchema: NonNullable<
    TWorkflowById['childWorkflows']
  >[number]['workflowDefinition']['contextSchema'];
  isKYC: boolean;
}) => {
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
  });

  const childWorkflow = parentWorkflow?.childWorkflows?.find(
    workflow => workflow.id === childWorkflowId,
  );
  const childWorkflowDocuments = useMemo(() => {
    return (childWorkflow?.context?.documents || []) as TDocument[];
  }, [childWorkflow?.context?.documents]);
  const { documents } = useKycDocumentsAdapter({
    documents: childWorkflowDocuments,
  });

  const documentIds = useMemo(() => {
    if (isKYC) {
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
  }, [documents, isKYC]);

  // Mutations
  const { mutate: mutateApproveCase, isLoading: isLoadingApproveCase } =
    useApproveCaseAndDocumentsMutation({
      workflowId: childWorkflowId,
      ids: documentIds,
      isDocumentsV2: isKYC ? false : !!parentWorkflow?.workflowDefinition?.config?.isDocumentsV2,
    });
  const { mutate: mutateRevisionCase, isLoading: isLoadingRevisionCase } =
    useRevisionCaseAndDocumentsMutation({
      workflowId: childWorkflowId,
      ids: documentIds,
      isDocumentsV2: isKYC ? false : !!parentWorkflow?.workflowDefinition?.config?.isDocumentsV2,
    });
  // /Mutations

  // Callbacks
  const onReasonChange = useCallback((value: string) => setReason(value), [setReason]);
  const onCommentChange = useCallback((value: string) => setComment(value), [setComment]);
  const onMutateApproveCase = useCallback(() => {
    mutateApproveCase({
      ids: documentIds,
      workflowId: childWorkflowId,
    });
  }, [mutateApproveCase, documentIds, childWorkflowId]);
  const onMutateRevisionCase = useCallback(
    (revisionReason: string) => () =>
      mutateRevisionCase({
        ids: documentIds,
        workflowId: childWorkflowId,
        revisionReason,
      }),
    [mutateRevisionCase, documentIds, childWorkflowId],
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
