import { DocumentType } from '../../contexts/app-state';
import { TDocumentType } from '../../contexts/app-state/types';

export const getOverlayDocumentType = (
  documentType: TDocumentType,
): 'card' | 'passport' | 'a4' | 'selfie' => {
  const cardOverlayDocumentTypes: TDocumentType[] = [
    DocumentType.DRIVERS_LICENSE,
    DocumentType.RESIDENCE_PERMIT,
    DocumentType.ID_CARD,
    DocumentType.VOTER_ID,
    DocumentType.WORK_PERMIT,
    DocumentType.VISA,
  ];

  if (cardOverlayDocumentTypes.includes(documentType)) {
    return 'card';
  }
  if (documentType === DocumentType.PASSPORT) {
    return 'passport';
  }
  if (documentType === DocumentType.SELFIE) {
    return 'selfie';
  }
  return 'a4';
};
