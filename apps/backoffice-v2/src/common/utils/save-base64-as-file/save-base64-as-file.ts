export const saveBase64AsFile = (base64: string, fileName?: string) => {
  const link = document.createElement('a');

  link.download = fileName || 'file';
  link.href = base64;

  link.click();
};
