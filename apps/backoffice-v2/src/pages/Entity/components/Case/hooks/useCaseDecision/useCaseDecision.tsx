import { safeEvery, someDocumentDecisionStatus } from '@ballerine/common';
import { Action } from '../../../../../../common/enums';
import { useFilterId } from '../../../../../../common/hooks/useFilterId/useFilterId';
import { useWorkflowByIdQuery } from '@/domains/workflows/hooks/queries/useWorkflowByIdQuery/useWorkflowByIdQuery';
import { useParams } from 'react-router-dom';
import { useAuthenticatedUserQuery } from '../../../../../../domains/auth/hooks/queries/useAuthenticatedUserQuery/useAuthenticatedUserQuery';
import { useCaseState } from '../useCaseState/useCaseState';
import { useMemo } from 'react';
import { selectDirectorsDocuments } from '@/pages/Entity/selectors/selectDirectorsDocuments';
import { useDocumentsAdapter } from '@/domains/documents/hooks/useDocumentsAdapter/useDocumentsAdapter';

export const useCaseDecision = () => {
  const filterId = useFilterId();
  const { entityId: workflowId } = useParams();
  const { data: workflow } = useWorkflowByIdQuery({ workflowId, filterId });
  const childWorkflows = useMemo(
    () =>
      workflow?.childWorkflows?.filter(
        childWorkflow => childWorkflow?.context?.entity?.type === 'business',
      ),
    [workflow?.childWorkflows],
  );
  const childEntityIds = useMemo(() => {
    return childWorkflows?.map(childWorkflow => childWorkflow?.context?.entity?.ballerineEntityId);
  }, [workflow?.childWorkflows]);
  const { documents: childDocuments } = useDocumentsAdapter({
    entityIds: childEntityIds ?? [],
    documents: childWorkflows?.flatMap(childWorkflow => childWorkflow?.context?.documents) ?? [],
  });
  const { documents: parentDocuments } = useDocumentsAdapter({
    entityIds: [workflow?.context?.entity?.ballerineEntityId ?? ''],
    documents: workflow?.context?.documents ?? [],
  });
  const directorsIds = useMemo(() => {
    return workflow?.context?.entity?.data?.additionalInfo?.directors?.map(
      director => director.ballerineEntityId,
    );
  }, [workflow?.context?.entity?.data?.additionalInfo?.directors]);
  const { documents: directorsDocuments } = useDocumentsAdapter({
    entityIds: directorsIds ?? [],
    documents: selectDirectorsDocuments(workflow),
  });
  const { data: session } = useAuthenticatedUserQuery();
  const authenticatedUser = session?.user;
  const caseState = useCaseState(authenticatedUser, workflow);
  const hasDecision = safeEvery(parentDocuments, document => !!document?.decision?.status);
  const canTakeAction = caseState.actionButtonsEnabled && hasDecision;
  // Disable the reject/approve buttons if the end user is not ready to be rejected/approved.
  // Based on `workflowDefinition` - ['APPROVE', 'REJECT', 'RECOLLECT'].
  const canReject = caseState.actionButtonsEnabled && workflow?.nextEvents?.includes(Action.REJECT);
  const canRevision =
    caseState.actionButtonsEnabled &&
    workflow?.nextEvents?.includes(Action.REVISION) &&
    someDocumentDecisionStatus(
      [...parentDocuments, ...directorsDocuments, ...childDocuments],
      'revision',
    );

  const canApprove =
    !canRevision &&
    caseState.actionButtonsEnabled &&
    workflow?.nextEvents?.includes(Action.APPROVE);
  const workflowLevelResolution =
    workflow?.workflowDefinition?.config?.workflowLevelResolution ??
    workflow?.context?.entity?.type === 'business';
  const noAction = workflowLevelResolution && !canApprove && !canReject && !canRevision;

  return {
    hasDecision,
    canTakeAction,
    canApprove,
    canReject,
    canRevision,
    noAction,
  };
};
