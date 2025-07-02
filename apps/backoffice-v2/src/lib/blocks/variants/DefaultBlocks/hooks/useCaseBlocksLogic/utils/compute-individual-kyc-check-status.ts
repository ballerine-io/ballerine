import { EndUserApprovalState, TEndUser } from '@/domains/individuals/fetchers';
import { TWorkflowById } from '@/domains/workflows/fetchers';
import { ObjectValues, StateTag } from '@ballerine/common';

export const IndividualKycCheckStatus = {
  REVISION: 'revision',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  PENDING: 'pending',
} as const;

export type TIndividualKycCheckStatus = ObjectValues<typeof IndividualKycCheckStatus>;

const getStatusFromTags = (tags: string[]) => {
  if (tags?.includes(StateTag.REVISION)) {
    return IndividualKycCheckStatus.REVISION;
  }

  if (tags?.includes(StateTag.APPROVED)) {
    return IndividualKycCheckStatus.APPROVED;
  }

  if (tags?.includes(StateTag.REJECTED)) {
    return IndividualKycCheckStatus.REJECTED;
  }

  if (tags?.includes(StateTag.PENDING_PROCESS)) {
    return IndividualKycCheckStatus.PENDING;
  }
};

const getStatusFromEndUser = (endUser: TEndUser) => {
  if (endUser?.individualVerificationsChecks?.status === 'in-progress') {
    return IndividualKycCheckStatus.PENDING;
  }

  if (
    !endUser?.approvalState ||
    [EndUserApprovalState.NEW, EndUserApprovalState.PROCESSING].includes(endUser?.approvalState)
  ) {
    return IndividualKycCheckStatus.PENDING;
  }

  if (endUser?.approvalState === EndUserApprovalState.APPROVED) {
    return IndividualKycCheckStatus.APPROVED;
  }

  if (endUser?.approvalState === EndUserApprovalState.REJECTED) {
    return IndividualKycCheckStatus.REJECTED;
  }
};

export const computeIndividualKycCheckStatus = ({
  endUser,
  tags,
}: {
  endUser: TEndUser;
  tags: TWorkflowById['tags'];
}): TIndividualKycCheckStatus | undefined => {
  if (endUser?.individualVerificationsChecks?.status === 'in-progress') {
    return IndividualKycCheckStatus.PENDING;
  }

  const statusFromTags = getStatusFromTags(tags || []);
  const endUserStatus = getStatusFromEndUser(endUser);

  const isPending = [endUserStatus, statusFromTags].includes(IndividualKycCheckStatus.PENDING);
  const isApproved = [endUser.approvalState, statusFromTags].includes(
    EndUserApprovalState.APPROVED,
  );
  const isRejected = [endUser.approvalState, statusFromTags].includes(
    EndUserApprovalState.REJECTED,
  );

  if (isPending) {
    return IndividualKycCheckStatus.PENDING;
  }

  if (isApproved) {
    return IndividualKycCheckStatus.APPROVED;
  }

  if (isRejected) {
    return IndividualKycCheckStatus.REJECTED;
  }
};
