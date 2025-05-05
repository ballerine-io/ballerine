import { DocumentVerificationStatuses } from '@/domains/document-verification/fetchers';

type TDocumentVerificationStatus = (typeof DocumentVerificationStatuses)[number];

export const getStatusVariant = (
  status: TDocumentVerificationStatus,
): 'default' | 'outline' | 'secondary' | 'destructive' | 'success' => {
  switch (status) {
    case 'pending':
      return 'secondary';
    case 'verified':
      return 'success';
    case 'rejected':
      return 'destructive';
    default:
      return 'default';
  }
};
