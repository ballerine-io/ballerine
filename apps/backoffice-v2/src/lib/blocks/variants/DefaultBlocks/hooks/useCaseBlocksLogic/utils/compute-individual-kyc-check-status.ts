import { EndUserApprovalState, TEndUser } from '@/domains/individuals/fetchers';
import { TWorkflowById } from '@/domains/workflows/fetchers';
import { ObjectValues, StateTag } from '@ballerine/common';

export const INDIVIDUAL_KYC_CHECK_STATUS_ENUM = {
  REVISION: 'revision',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  PENDING: 'pending',
} as const;

export type TIndividualKycCheckStatus = ObjectValues<typeof INDIVIDUAL_KYC_CHECK_STATUS_ENUM>;

const getStatusFromTags = (tags: string[]) => {
  if (tags?.includes(StateTag.REVISION)) {
    return INDIVIDUAL_KYC_CHECK_STATUS_ENUM.REVISION;
  }

  if (tags?.includes(StateTag.APPROVED)) {
    return INDIVIDUAL_KYC_CHECK_STATUS_ENUM.APPROVED;
  }

  if (tags?.includes(StateTag.REJECTED)) {
    return INDIVIDUAL_KYC_CHECK_STATUS_ENUM.REJECTED;
  }

  if (tags?.includes(StateTag.PENDING_PROCESS)) {
    return INDIVIDUAL_KYC_CHECK_STATUS_ENUM.PENDING;
  }
};

export const computeIndividualKycCheckStatus = ({
  endUser,
  tags,
}: {
  endUser?: TEndUser;
  tags: TWorkflowById['tags'];
}): TIndividualKycCheckStatus | undefined => {
  if (endUser?.individualVerificationsChecks?.status === 'in-progress') {
    return INDIVIDUAL_KYC_CHECK_STATUS_ENUM.PENDING;
  }

  if (
    !endUser?.approvalState ||
    [EndUserApprovalState.NEW, EndUserApprovalState.PROCESSING].includes(endUser?.approvalState)
  ) {
    return getStatusFromTags(tags || []);
  }

  if (endUser?.approvalState === EndUserApprovalState.APPROVED) {
    return INDIVIDUAL_KYC_CHECK_STATUS_ENUM.APPROVED;
  }

  if (endUser?.approvalState === EndUserApprovalState.REJECTED) {
    return INDIVIDUAL_KYC_CHECK_STATUS_ENUM.REJECTED;
  }
};
