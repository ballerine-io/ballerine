export const NO_AUTH_USER_KEY = 'no_auth_user_id' as const;

export const Category = {
  ID_CARD: 'id',
  SELFIE: 'selfie',
  CERTIFICATE_OF_INCORPORATION: 'incorporation',
} as const;

export const Type = {
  PHOTO: 'photo',
  PDF: 'pdf',
} as const;

export const ISSUER_COUNTRY = 'canada' as const;

export const DocumentId = {
  ID_CARD: `${Category.ID_CARD}-${Type.PHOTO}-${ISSUER_COUNTRY}`,
  SELFIE: `${Category.SELFIE}-${Type.PHOTO}-${ISSUER_COUNTRY}`,
  CERTIFICATE_OF_INCORPORATION: `${Category.CERTIFICATE_OF_INCORPORATION}-${Type.PDF}-${ISSUER_COUNTRY}`,
} as const;
