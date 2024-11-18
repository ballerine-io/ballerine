import validator from 'validator';

export const isBrowser = () => typeof window !== 'undefined';

/**
 * Sanitizes query parameter values to prevent XSS and injection attacks
 */
export const sanitizeQueryParam = (param: string): string => {
  return validator.escape(param.trim());
};

export const getGlobalQueryParams = (): Record<string, string | string[]> => {
  if (!isBrowser()) return {};

  const searchParams = new URLSearchParams(window.location.search);
  const paramsObject: Record<string, string | string[]> = {};

  // Handle multiple values for the same parameter
  for (const [key, value] of searchParams.entries()) {
    const sanitizedValue = sanitizeQueryParam(value);
    const sanitizedKey = sanitizeQueryParam(key);

    if (sanitizedKey in paramsObject) {
      const existing = paramsObject[sanitizedKey];
      paramsObject[sanitizedKey] = Array.isArray(existing)
        ? [...existing, sanitizedValue]
        : [existing as string, sanitizedValue];
    } else {
      paramsObject[sanitizedKey] = sanitizedValue;
    }
  }

  return paramsObject;
};
