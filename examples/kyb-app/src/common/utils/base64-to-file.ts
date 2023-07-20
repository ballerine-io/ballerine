export const base64ToFile = (base64: string, fileName: string, mimeType: string): File => {
  const byteCharacters = base64;
  const byteArrays = new Uint8Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteArrays[i] = byteCharacters.charCodeAt(i);
  }

  const blob = new Blob([byteArrays], { type: mimeType });
  const file = new File([blob], fileName, { type: mimeType });

  return file;
};
