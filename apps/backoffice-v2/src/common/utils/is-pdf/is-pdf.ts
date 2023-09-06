export const isPdf = (file: { imageUrl: string; fileType: string }) =>
  file?.fileType === 'application/pdf' ||
  file?.fileType === 'pdf' ||
  file?.imageUrl?.endsWith('.pdf');
