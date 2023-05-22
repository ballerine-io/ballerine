import { TCaseManagementState } from './api/types';

export const Method = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
} as const;

export const State = {
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  PROCESSING: 'PROCESSING',
  NEW: 'NEW',
} as const;

export const CaseStatus = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  FAILED: 'failed',
} as const;

export const CaseStatuses = [CaseStatus.ACTIVE, CaseStatus.COMPLETED, CaseStatus.FAILED] as const;

export const States = [State.APPROVED, State.REJECTED, State.PROCESSING, State.NEW] as const;

export const Action = {
  REJECT: 'REJECT',
  APPROVE: 'APPROVE',
  ASSIGNED_TO_ME: 'ASSIGNED_TO_ME',
  ASSIGNED_TO_OTHER: 'ASSIGNED_TO_OTHER',
  RESUBMIT: 'RESUBMIT',
  SIGN_IN: 'SIGN_IN',
  SIGN_OUT: 'SIGN_OUT',
} as const;
export const Resource = {
  END_USER: 'END_USER',
  ASSIGNMENT: 'ASSIGNMENT',
} as const;

type TCaseStateEnum = {
  [key: string]: TCaseManagementState;
};
export const CaseState: TCaseStateEnum = {
  UNASSIGNED: {
    state: 'unassigned',
    readEnabled: true,
    writeEnabled: false,
    assignToMeEnabled: true,
    assignToOtherEnabled: true,
    actionButtonsEnabled: false,
  },
  ASSIGNED_TO_ME: {
    state: 'assignedToMe',
    readEnabled: true,
    writeEnabled: true,
    assignToMeEnabled: false,
    assignToOtherEnabled: true,
    actionButtonsEnabled: true,
  },
  ASSIGNED_TO_OTHER: {
    state: 'assignToOther',
    readEnabled: true,
    writeEnabled: false,
    assignToMeEnabled: true,
    assignToOtherEnabled: true,
    actionButtonsEnabled: false,
  },
  UNKNOWN: {
    state: 'unknown',
    readEnabled: false,
    writeEnabled: false,
    assignToMeEnabled: false,
    assignToOtherEnabled: false,
    actionButtonsEnabled: false,
  },
} as const;
