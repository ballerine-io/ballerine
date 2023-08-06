export const octetToFileType = (base64: string, fileType: string) =>
  base64?.replace(/application\/octet-stream/gi, fileType);
