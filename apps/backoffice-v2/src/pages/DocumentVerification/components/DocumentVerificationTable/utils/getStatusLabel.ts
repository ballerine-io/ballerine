import { DocumentVerificationStatuses } from '@/domains/document-verification/fetchers';

type TDocumentVerificationStatus = (typeof DocumentVerificationStatuses)[number];

export const getStatusLabel = (status: TDocumentVerificationStatus) => {
  switch (status) {
    case 'pending':
      return 'Pending';
    case 'verified':
      return 'Verified';
    case 'rejected':
      return 'Rejected';
    default:
      return (status as string).charAt(0).toUpperCase() + (status as string).slice(1);
  }
};
