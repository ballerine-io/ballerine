/**
 * @description Returns fallback argument if value is null or undefined.
 * @param fallback Fallback value to return if value is null or undefined.
 * @param checkFalsy If true, will return fallback if value is falsy instead of null or undefined.
 */
export const valueOrFallback =
  <TFallback>(
    fallback: TFallback,
    {
      checkFalsy,
    }: {
      checkFalsy?: boolean;
    } = {
      checkFalsy: false,
    },
  ) =>
  <TValue>(value: TValue) => {
    if (checkFalsy) {
      return value || fallback;
    }

    return value ?? fallback;
  };
