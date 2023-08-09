export const base64ToFile = async (
  base64: string,
  fileName: string,
  mimeType: string,
): Promise<File> => {
  return await fetch(base64)
    .then(res => res.blob())
    .then(blob => new File([blob], fileName, { type: mimeType }));
};
