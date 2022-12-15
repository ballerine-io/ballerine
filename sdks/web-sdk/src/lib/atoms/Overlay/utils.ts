import { EDocumentType } from '../../contexts/app-state';

export const getOverlayDocumentType = (
  documentType: EDocumentType,
): 'card' | 'passport' | 'a4' | 'selfie' => {
  const cardOverlayDocumentTypes = [
    EDocumentType.DRIVERS_LICENSE,
    EDocumentType.RESIDENCE_PERMIT,
    EDocumentType.ID_CARD,
    EDocumentType.VOTER_ID,
    EDocumentType.WORK_PERMIT,
    EDocumentType.VISA,
  ];

  if (cardOverlayDocumentTypes.includes(documentType)) {
    return 'card';
  }
  if (documentType === EDocumentType.PASSPORT) {
    return 'passport';
  }
  if (documentType === EDocumentType.SELFIE) {
    return 'selfie';
  }
  return 'a4';
};
