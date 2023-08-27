import { safeEvery, someDocumentDecisionStatus } from '@ballerine/common';
import { Action } from '../../../../../../common/enums';
import { useFilterId } from '../../../../../../common/hooks/useFilterId/useFilterId';
import { useWorkflowQuery } from '../../../../../../domains/workflows/hooks/queries/useWorkflowQuery/useWorkflowQuery';
import { useParams } from 'react-router-dom';
import { useAuthenticatedUserQuery } from '../../../../../../domains/auth/hooks/queries/useAuthenticatedUserQuery/useAuthenticatedUserQuery';
import { useCaseState } from '../useCaseState/useCaseState';

export const useCaseDecision = () => {
  const filterId = useFilterId();
  const { entityId: workflowId } = useParams();
  const { data: workflow } = useWorkflowQuery({ workflowId, filterId });
  const {
    data: { user: authenticatedUser },
  } = useAuthenticatedUserQuery();
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
    someDocumentDecisionStatus(workflow?.context?.documents, 'revision');
  const canApprove =
    !canRevision &&
    caseState.actionButtonsEnabled &&
    workflow?.nextEvents?.includes(Action.APPROVE);
  const noAction =
    workflow?.workflowDefinition?.config?.workflowLevelResolution &&
    !canApprove &&
    !canReject &&
    !canRevision;

  return {
    hasDecision,
    canTakeAction,
    canApprove,
    canReject,
    canRevision,
    noAction,
  };
};
