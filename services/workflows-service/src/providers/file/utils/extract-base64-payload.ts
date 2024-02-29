export const extractBase64Payload = (base64: string): string => {
  return base64.split(',')[1] as string;
};
