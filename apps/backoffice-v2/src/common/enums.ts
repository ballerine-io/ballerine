import { TObjectValues } from './types';

export const CommunicationChannel = {
  OPEN_DOCUMENT_IN_NEW_TAB: 'OPEN_DOCUMENT_IN_NEW_TAB',
} as const;

export const CommunicationChannelEvent = {
  OPEN_DOCUMENT_IN_NEW_TAB: 'OPEN_DOCUMENT_IN_NEW_TAB',
  OPEN_DOCUMENT_IN_NEW_TAB_ACK: 'OPEN_DOCUMENT_IN_NEW_TAB_ACK',
} as const;

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
  REJECT: 'reject',
  APPROVE: 'approve',
  REVISION: 'revision',
  CASE_REVIEWED: 'CASE_REVIEWED',
  DISMISS: 'dismiss',
  FLAG: 'flag',
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
