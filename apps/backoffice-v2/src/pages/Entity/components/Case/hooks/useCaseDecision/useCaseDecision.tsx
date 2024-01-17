import { safeEvery, someDocumentDecisionStatus } from '@ballerine/common';
import { Action } from '../../../../../../common/enums';
import { useFilterId } from '../../../../../../common/hooks/useFilterId/useFilterId';
import { useWorkflowByIdQuery } from '@/domains/workflows/hooks/queries/useWorkflowByIdQuery/useWorkflowByIdQuery';
import { useParams } from 'react-router-dom';
import { useAuthenticatedUserQuery } from '../../../../../../domains/auth/hooks/queries/useAuthenticatedUserQuery/useAuthenticatedUserQuery';
import { useCaseState } from '../useCaseState/useCaseState';
import { useMemo } from 'react';
import { selectDirectorsDocuments } from '@/pages/Entity/selectors/selectDirectorsDocuments';

export const useCaseDecision = () => {
  const filterId = useFilterId();
  const { entityId: workflowId } = useParams();
  const { data: workflow } = useWorkflowByIdQuery({ workflowId, filterId });
  const childDocuments = useMemo(() => {
    return (
      workflow?.childWorkflows
        ?.filter(childWorkflow => childWorkflow?.context?.entity?.type === 'business')
        ?.flatMap(childWorkflow => childWorkflow?.context?.documents) || []
    );
  }, [workflow?.childWorkflows]);
  const parentDocuments = workflow?.context?.documents || [];
  const directorsDocuments = selectDirectorsDocuments(workflow) || [];
  const { data: session } = useAuthenticatedUserQuery();
  const authenticatedUser = session?.user;
  const caseState = useCaseState(authenticatedUser, workflow);
  const hasDecision = safeEvery(
    workflow?.context?.documents,
    document => !!document?.decision?.status,
  );
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
