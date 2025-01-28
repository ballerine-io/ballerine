export const formatErrorMessage = (message: string, key: string, value: string) =>
  message.replaceAll(`{${key}}`, value);
