import CryptoJS from 'crypto-js';

export const encryptData = (data: string, secret: string): string => {
  // Encrypt the data using AES encryption
  const encrypted = CryptoJS.AES.encrypt(data, secret).toString();

  return encrypted;
};

export const decryptData = (encryptedData: string, secret: string): string => {
  // Decrypt the data using AES decryption
  const bytes = CryptoJS.AES.decrypt(encryptedData, secret);
  const decrypted = bytes.toString(CryptoJS.enc.Utf8); // Convert decrypted bytes back to UTF-8 string

  return decrypted;
};