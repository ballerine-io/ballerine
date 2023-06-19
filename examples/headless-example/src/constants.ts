export const ENTITY_ID_STORAGE_KEY = 'entityId' as const;

export const Category = {
  ID_CARD: 'id',
  SELFIE: 'selfie',
  CERTIFICATE_OF_INCORPORATION: 'incorporation',
} as const;

export const Type = {
  PHOTO: 'photo',
  PDF: 'pdf',
} as const;

export const ISSUER_COUNTRY = 'CA' as const;

export const DocumentId = {
  ID_CARD: `${Category.ID_CARD}-${Type.PHOTO}-${ISSUER_COUNTRY}`,
  SELFIE: `${Category.SELFIE}-${Type.PHOTO}-${ISSUER_COUNTRY}`,
  CERTIFICATE_OF_INCORPORATION: `${Category.CERTIFICATE_OF_INCORPORATION}-${Type.PDF}-${ISSUER_COUNTRY}`,
} as const;
