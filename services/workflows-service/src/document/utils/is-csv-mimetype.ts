export const isCsvMimetype = (mimeType: string | null) =>
  mimeType === 'text/csv' || mimeType === 'application/csv';
