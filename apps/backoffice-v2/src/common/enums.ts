import { TObjectValues } from './types';

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
  INDIVIDUAL: 'INDIVIDUAL',
  ASSIGNMENT: 'ASSIGNMENT',
} as const;

export interface ICaseStateEnum {
  [key: string]: {
    state: string;
    readEnabled: boolean;
    writeEnabled: boolean;
    assignToMeEnabled: boolean;
    assignToOtherEnabled: boolean;
    unassignedEnabled?: boolean;
    actionButtonsEnabled: boolean;
  };
}

export const CaseState = {
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
} as const satisfies ICaseStateEnum;

export type TCaseState = TObjectValues<typeof CaseState>;
