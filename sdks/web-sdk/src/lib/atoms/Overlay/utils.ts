import { DocumentType } from '../../contexts/app-state';

export const getOverlaySrc = (documentType: DocumentType) => {
  const cardOverlayDocumentTypes = [
    DocumentType.DRIVERS_LICENSE,
    DocumentType.RESIDENCE_PERMIT,
    DocumentType.ID_CARD,
    DocumentType.VOTER_ID,
    DocumentType.WORK_PERMIT,
    DocumentType.VISA,
  ];

  if (cardOverlayDocumentTypes.includes(documentType)) {
    return 'https://cdn.ballerine.io/ui-packs/default/images/card-overlay2.svg';
  }
  if (documentType === DocumentType.PASSPORT) {
    return 'https://cdn.ballerine.io/ui-packs/default/images/passport-overlay2.svg';
  }
  if (documentType === DocumentType.SELFIE) {
    return 'https://cdn.ballerine.io/ui-packs/default/images/selfie-overlay2.svg';
  }
  return 'https://cdn.ballerine.io/ui-packs/default/images/a4-overlay2.svg';
};
