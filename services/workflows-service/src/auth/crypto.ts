import { env } from '@/env';
import CryptoJS from 'crypto-js';

export const encryptData = (data: string): string => {
  // Encrypt the data using AES encryption
  const encrypted = CryptoJS.AES.encrypt(data, env.SESSION_ENCRYPTION_SECRET).toString();

  return encrypted;
};

export const decryptData = (encryptedData: string): string => {
  // Decrypt the data using AES decryption
  const bytes = CryptoJS.AES.decrypt(encryptedData, env.SESSION_ENCRYPTION_SECRET);
  const decrypted = bytes.toString(CryptoJS.enc.Utf8); // Convert decrypted bytes back to UTF-8 string

  return decrypted;
};
