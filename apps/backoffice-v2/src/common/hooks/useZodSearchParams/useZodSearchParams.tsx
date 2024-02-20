import { AnyZodObject, z } from 'zod';
import { useEffect, useMemo } from 'react';
import { ISerializedSearchParams } from './interfaces';
import { useSerializedSearchParams } from '@/common/hooks/useSerializedSearchParams/useSerializedSearchParams';
import { checkIsLooselyEqualDeep } from '@/common/utils/check-is-loosely-equal-deep/check-is-loosely-equal-deep';

export const useZodSearchParams = <TSchema extends AnyZodObject>(
  schema: TSchema,
  options: ISerializedSearchParams = {},
) => {
  const [searchParams, setSearchParams] = useSerializedSearchParams(options);
  const parsedSearchParams = useMemo(() => schema.parse(searchParams), [schema, searchParams]);

  useEffect(() => {
    const isSearchParamsEqual = checkIsLooselyEqualDeep(searchParams, parsedSearchParams);
    console.log('test');
    if (isSearchParamsEqual) {
      return;
    }

    return setSearchParams(parsedSearchParams);
  }, [parsedSearchParams, searchParams, setSearchParams]);

  return [parsedSearchParams as z.output<TSchema>, setSearchParams] as const;
};
