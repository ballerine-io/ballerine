import { z, ZodSchema } from 'zod';
import { useSearchParams } from 'react-router-dom';
import { useCallback, useMemo } from 'react';
import { IUseZodSearchParams } from './interfaces';
import { defaultDeserializer } from './utils/default-deserializer';
import { defaultSerializer } from './utils/default-serializer';

export const useZodSearchParams = <TSchema extends ZodSchema>(
  schema: TSchema,
  options: IUseZodSearchParams = {},
) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const deserializer = options.deserializer ?? defaultDeserializer;
  const serializer = options.serializer ?? defaultSerializer;
  const searchParamsAsObject = useMemo(
    () => deserializer(searchParams.toString()),
    [deserializer, searchParams],
  );
  const parsedSearchParams = useMemo(
    () => schema.parse(searchParamsAsObject),
    [schema, searchParamsAsObject],
  );
  const onSetSearchParams = useCallback(
    (searchParams: Record<string, unknown>) => {
      setSearchParams(
        new URLSearchParams(
          serializer({
            ...parsedSearchParams,
            ...searchParams,
          }),
        ),
      );
    },
    [parsedSearchParams, serializer, setSearchParams],
  );

  return [parsedSearchParams as z.output<TSchema>, onSetSearchParams] as const;
};
