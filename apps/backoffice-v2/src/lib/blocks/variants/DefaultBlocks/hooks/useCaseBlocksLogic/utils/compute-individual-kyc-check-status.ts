import { EndUserApprovalState, TEndUser } from '@/domains/individuals/fetchers';
import { TWorkflowById } from '@/domains/workflows/fetchers';
import { ObjectValues, StateTag } from '@ballerine/common';

export const INDIVIDUAL_KYC_CHECK_STATUS_ENUM = {
  revision: 'revision',
  approved: 'approved',
  rejected: 'rejected',
  pending: 'pending',
} as const;

export type TIndividualKycCheckStatus = ObjectValues<typeof INDIVIDUAL_KYC_CHECK_STATUS_ENUM>;

const getStatusFromTags = (tags: string[]) => {
  if (tags?.includes(StateTag.REVISION)) {
    return INDIVIDUAL_KYC_CHECK_STATUS_ENUM.revision;
  }

  if (tags?.includes(StateTag.APPROVED)) {
    return INDIVIDUAL_KYC_CHECK_STATUS_ENUM.approved;
  }

  if (tags?.includes(StateTag.REJECTED)) {
    return INDIVIDUAL_KYC_CHECK_STATUS_ENUM.rejected;
  }

  if (tags?.includes(StateTag.PENDING_PROCESS)) {
    return INDIVIDUAL_KYC_CHECK_STATUS_ENUM.pending;
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
    return INDIVIDUAL_KYC_CHECK_STATUS_ENUM.pending;
  }

  if (
    !endUser?.approvalState ||
    [EndUserApprovalState.NEW, EndUserApprovalState.PROCESSING].includes(endUser?.approvalState)
  ) {
    return getStatusFromTags(tags || []);
  }

  if (endUser?.approvalState === EndUserApprovalState.APPROVED) {
    return INDIVIDUAL_KYC_CHECK_STATUS_ENUM.approved;
  }

  if (endUser?.approvalState === EndUserApprovalState.REJECTED) {
    return INDIVIDUAL_KYC_CHECK_STATUS_ENUM.rejected;
  }
};
