import get from 'lodash.get';

export const isBrowser = () => typeof window !== 'undefined';

export const getGlobalQueryParams = () => {
  if (!isBrowser()) return {};

  const searchParams = new URLSearchParams(window.location.search);
  const paramsObject: Record<string, string> = {};

  searchParams.forEach((value, key) => {
    paramsObject[key] = value;
  });

  return paramsObject;
};

export const formatStringValues = (
  str: string,
  data: Record<string, string | Record<string, string>>,
) => {
  // Find all placeholders in curly braces
  const placeholders = str.match(/{(.*?)}/g);

  if (!placeholders) return str;

  let formattedString = str;

  // Replace each placeholder with its value from data
  for (const placeholder of placeholders) {
    const path = placeholder.replace(/{|}/g, ''); // Remove curly braces
    const value = get(data, path);

    // Replace placeholder with value if found
    if (value !== undefined) {
      formattedString = formattedString.replace(placeholder, String(value));
    }
  }

  return formattedString;
};
