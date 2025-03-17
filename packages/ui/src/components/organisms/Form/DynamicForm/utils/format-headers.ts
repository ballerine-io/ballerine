import { formatString } from './format-string';

export const formatHeaders = (
  headers: Record<string, string>,
  metadata: Record<string, string> = {},
) => {
  const formattedHeaders: Record<string, string> = {};

  Object.entries(headers).forEach(([key, value]) => {
    const formattedValue = formatString(value, metadata);
    formattedHeaders[key] = formattedValue;
  });

  return formattedHeaders;
};
