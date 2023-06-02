import { z, ZodSchema } from 'zod';
import { useSearchParams } from 'react-router-dom';
import { useCallback } from 'react';

export const useZodSearchParams = <TSchema extends ZodSchema>(schema: TSchema) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchParamsAsObject = Object.fromEntries(searchParams.entries());
  const parsedSearchParams = schema.parse(searchParamsAsObject);
  const onSetSearchParams = useCallback(
    (searchParams: Record<string, unknown>) => {
      const newSearchParams = new URLSearchParams();

      Object.entries(searchParams).forEach(([key, value]) => {
        newSearchParams.set(key, value?.toString());
      });

      setSearchParams(newSearchParams);
    },
    [setSearchParams],
  );

  return [parsedSearchParams as z.output<TSchema>, onSetSearchParams] as const;
};
