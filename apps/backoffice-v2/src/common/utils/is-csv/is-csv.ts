export const isCsv = <T extends { fileType: string }>(document: T) =>
  document?.fileType === 'text/csv' || document?.fileType === 'application/csv';
