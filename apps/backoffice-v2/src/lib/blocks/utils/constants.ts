export const USER_CREATED_LABEL_CDN_LINK = '/assets/logos/label-user.svg';
export const SYSTEM_CREATED_LABEL_CDN_LINK = '/assets/logos/label-system.svg';

export const userCreatedIconCell = {
  type: 'image',
  value: USER_CREATED_LABEL_CDN_LINK,
  props: {
    width: '40px',
    height: '40px',
    className: '[&>figcaption]:sr-only',
  },
} as const;
export const systemCreatedIconCell = {
  type: 'image',
  value: SYSTEM_CREATED_LABEL_CDN_LINK,
  props: {
    width: '40px',
    height: '40px',
    className: '[&>figcaption]:sr-only',
  },
} as const;
