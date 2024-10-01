import CryptoJS from 'crypto-js';

export const sign = ({ payload, key }: { payload: unknown; key: string }) => {
  if (!key) {
    return 'UNSIGNED';
  }

  return CryptoJS.HmacSHA256(JSON.stringify(payload), key).toString(CryptoJS.enc.Hex);
};

export const computeHash = (data: unknown): string => {
  const md5hash = CryptoJS.MD5(JSON.stringify(data));

  return md5hash.toString(CryptoJS.enc.Hex);
};
