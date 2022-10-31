import { DocumentType } from '../../contexts/app-state';

export const getOverlayDocumentType = (
  documentType: DocumentType,
): 'card' | 'passport' | 'a4' | 'selfie' => {
  const cardOverlayDocumentTypes = [
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
