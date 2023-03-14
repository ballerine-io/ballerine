export const isNullish = (value: unknown): value is null | undefined =>
  value === null || value === undefined;
