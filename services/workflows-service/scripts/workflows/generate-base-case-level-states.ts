import { CommonWorkflowEvent, CommonWorkflowStates, StateTag } from '@ballerine/common';

export const generateBaseCaseLevelStates = (
  defaultState: string = CommonWorkflowStates.MANUAL_REVIEW,
  defaultResubmitEvent: string = CommonWorkflowEvent.RETURN_TO_REVIEW,
) =>
  ({
    [defaultState]: {
      tags: [StateTag.MANUAL_REVIEW],
      on: {
        [CommonWorkflowEvent.REJECT]: { target: CommonWorkflowStates.REJECTED },
        [CommonWorkflowEvent.APPROVE]: { target: CommonWorkflowStates.APPROVED },
        [CommonWorkflowEvent.REVISION]: { target: CommonWorkflowStates.REVISION },
      },
    },
    [CommonWorkflowStates.REJECTED]: {
      tags: [StateTag.REJECTED],
      type: 'final',
    },
    [CommonWorkflowStates.APPROVED]: {
      tags: [StateTag.APPROVED],
      type: 'final',
    },
    [CommonWorkflowStates.RESOLVED]: {
      tags: [StateTag.RESOLVED],
      type: 'final',
    },
    [CommonWorkflowStates.REVISION]: {
      tags: [StateTag.REVISION],
      on: {
        [defaultResubmitEvent]: defaultState,
      },
    },
  } as const);

/**
 * Extends the base manual-review/revision flow with a "pending_resubmission" state that supports:
 * - sending a resubmission email (EMAIL_SENT/EMAIL_FAILURE)
 * - waiting for end-user updates (RESUBMITTED / COLLECTION_FLOW_FINISHED)
 * - returning the case to manual review (RETURN_TO_REVIEW)
 *
 * This is used by SL workflows to avoid duplicating the same manual/revision/resubmission graph.
 */
export const generateBaseCaseLevelStatesWithPendingResubmission = (params: {
  /**
   * The state to resume verification from after a resubmission (and after collection-flow completion).
   * Example: "document_verification", "business_document_check", "business_photo_classification".
   */
  resumeState: string;
  /**
   * Override the name of the manual review state if needed.
   * Defaults to "manual_review".
   */
  manualReviewState?: string;
  /**
   * Override the name of the pending resubmission state if needed.
   * Defaults to "pending_resubmission".
   */
  pendingResubmissionState?: string;
  /**
   * Override the revision state name if needed.
   * Defaults to "revision".
   */
  revisionState?: string;
}) => {
  const manualReviewState = params.manualReviewState ?? CommonWorkflowStates.MANUAL_REVIEW;
  const pendingResubmissionState = params.pendingResubmissionState ?? 'pending_resubmission';
  const revisionState = params.revisionState ?? CommonWorkflowStates.REVISION;

  const base = generateBaseCaseLevelStates(manualReviewState, CommonWorkflowEvent.RETURN_TO_REVIEW);

  return {
    ...base,
    [manualReviewState]: {
      tags: [StateTag.MANUAL_REVIEW],
      on: {
        [CommonWorkflowEvent.APPROVE]: { target: CommonWorkflowStates.APPROVED },
        [CommonWorkflowEvent.REJECT]: { target: CommonWorkflowStates.REJECTED },
        [CommonWorkflowEvent.REVISION]: { target: pendingResubmissionState },
      },
    },
    [pendingResubmissionState]: {
      tags: [StateTag.REVISION],
      on: {
        EMAIL_SENT: revisionState,
        EMAIL_FAILURE: manualReviewState,
        [CommonWorkflowEvent.RESUBMITTED]: params.resumeState,
        COLLECTION_FLOW_FINISHED: params.resumeState,
        [CommonWorkflowEvent.RETURN_TO_REVIEW]: manualReviewState,
      },
    },
    [revisionState]: {
      tags: [StateTag.REVISION],
      on: {
        // Allow re-triggering the email if needed (e.g., wrong contact info).
        [CommonWorkflowEvent.REVISION]: { target: pendingResubmissionState },
        [CommonWorkflowEvent.RESUBMITTED]: params.resumeState,
        COLLECTION_FLOW_FINISHED: params.resumeState,
        [CommonWorkflowEvent.RETURN_TO_REVIEW]: manualReviewState,
      },
    },
  } as const;
};

export const generateBaseCaseLevelStatesAutoTransitionOnRevision = (
  defaultState: string = CommonWorkflowStates.MANUAL_REVIEW,
  defaultResubmitEvent: string = CommonWorkflowEvent.RETURN_TO_REVIEW,
) => {
  const definition = generateBaseCaseLevelStates(defaultState, defaultResubmitEvent);

  return {
    ...definition,
    [CommonWorkflowStates.REVISION]: {
      ...definition[CommonWorkflowStates.REVISION],
      on: {
        ...definition[CommonWorkflowStates.REVISION].on,
      },
      always: {
        target: defaultState,
        cond: {
          type: 'jmespath',
          options: {
            rule: 'length(documents[?decision.status]) < length(documents)',
          },
        },
      },
    },
  };
};
