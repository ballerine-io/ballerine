import { TWorkflowById } from '@/domains/workflows/fetchers';
import { useWorkflowByIdQuery } from '@/domains/workflows/hooks/queries/useWorkflowByIdQuery/useWorkflowByIdQuery';
import { useBusinessDocuments } from '@/lib/blocks/hooks/useBusinessDocuments';
import { useDirectorsDocuments } from '@/lib/blocks/hooks/useDirectorsDocuments';
import { useUbosDocuments } from '@/lib/blocks/hooks/useUbosDocuments';
import { safeEvery, someDocumentDecisionStatus } from '@ballerine/common';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Action } from '../../../../../../common/enums';
import { useAuthenticatedUserQuery } from '../../../../../../domains/auth/hooks/queries/useAuthenticatedUserQuery/useAuthenticatedUserQuery';
import { useCaseState } from '../useCaseState/useCaseState';

export const useCaseDecision = () => {
  const { entityId: workflowId } = useParams();
  const { data: workflow } = useWorkflowByIdQuery({ workflowId: workflowId ?? '' });
  const [
    { documents: businessDocuments },
    { documents: directorsDocuments },
    { documents: ubosDocuments },
  ] = [
    useBusinessDocuments(workflow as TWorkflowById),
    useDirectorsDocuments(workflow as TWorkflowById),
    useUbosDocuments(workflow as TWorkflowById),
  ];

  const documents = useMemo(
    () => [...businessDocuments, ...directorsDocuments, ...ubosDocuments],
    [businessDocuments, directorsDocuments, ubosDocuments],
  );
  const { data: session } = useAuthenticatedUserQuery();
  const authenticatedUser = session?.user;
  const caseState = useCaseState(authenticatedUser, workflow);
  const hasDecision = safeEvery(documents, document => !!document?.decision?.status);
  const canTakeAction = caseState.actionButtonsEnabled && hasDecision;
  // Disable the reject/approve buttons if the end user is not ready to be rejected/approved.
  // Based on `workflowDefinition` - ['APPROVE', 'REJECT', 'RECOLLECT'].
  const canReject = caseState.actionButtonsEnabled && workflow?.nextEvents?.includes(Action.REJECT);
  const canRevision =
    caseState.actionButtonsEnabled &&
    workflow?.nextEvents?.includes(Action.REVISION) &&
    someDocumentDecisionStatus(documents, 'revision');

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
