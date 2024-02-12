import { AnyZodObject, z } from 'zod';
import { useEffect, useMemo } from 'react';
import { ISerializedSearchParams } from './interfaces';
import { useSerializedSearchParams } from '@/common/hooks/useSerializedSearchParams/useSerializedSearchParams';

export const useZodSearchParams = <TSchema extends AnyZodObject>(
  schema: TSchema,
  options: ISerializedSearchParams = {},
) => {
  const [searchParams, setSearchParams] = useSerializedSearchParams(options);
  const parsedSearchParams = useMemo(() => schema.parse(searchParams), [schema, searchParams]);

  useEffect(() => {
    setSearchParams(parsedSearchParams);
  }, []);

  return [parsedSearchParams as z.output<TSchema>, setSearchParams] as const;
};
